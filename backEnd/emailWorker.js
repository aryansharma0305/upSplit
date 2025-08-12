import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import transporter from './transporter.js';
import { errorQueue } from './queue.js';


const connection = new IORedis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });


function detectHtml(body) {
  return /<[a-z][\s\S]*>/i.test(body);
}

async function sendEmail(recipient, subject, body) {
  const isHtml = detectHtml(body);
  return transporter.sendMail({
    from: 'upsplit@aryan-sharma.xyz',
    to: recipient,
    subject,
    ...(isHtml
      ? { html: body, text: body.replace(/<[^>]+>/g, '') }
      : { text: body })
  });
}




new Worker('emailQueue', async (job) => {
  try {
    await sendEmail(job.data.recipient, job.data.subject, job.data.body);
    console.log(` Email sent to ${job.data.recipient}`);
  } catch (error) {
    console.error(`Failed to send to ${job.data.recipient}`);
    await errorQueue.add('retryEmail', job.data);
  }
}, { connection });



new Worker('errorQueue', async (job) => {
  try {
    await sendEmail(job.data.recipient, job.data.subject, job.data.body);
    console.log(` Retry successful`);
  } catch (error) {
    console.error(`❌ Retry failed`);
    await sendEmail(
      'upsplit@aryan-sharma.xyz',
      `Email delivery failed to ${job.data.recipient}`,
      `Your email to ${job.data.recipient} could not be delivered after two attempts.\n\nSubject: ${job.data.subject}\n\nBody:\n${job.data.body}`
    );
  }
}, { connection });
