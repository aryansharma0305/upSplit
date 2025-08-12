import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({ host: '127.0.0.1', port: 6379, maxRetriesPerRequest: null });

export const emailQueue = new Queue('emailQueue', { connection });

export const errorQueue = new Queue('errorQueue', { connection });


export async function scheduleEmail(recipient, subject, body, priority, time) {

    const delay = new Date(time).getTime() - Date.now();

    if (delay < 0) throw new Error('Scheduled time must be in the future');


    await emailQueue.add('sendEmail', { recipient, subject, body }, { priority, delay });

    console.log(`✅ Email scheduled for ${time}`);

}
