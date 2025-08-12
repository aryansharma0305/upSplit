import contactTransaction from "../models/contactTransaction.js";
import groupTransaction from "../models/groupTransaction.js";
import users from "../models/users.js";
import { scheduleEmail } from "../queue.js";

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = 10; 
    const skip = (page - 1) * limit;

    const contactTx = await contactTransaction.find({
      $or: [{ id_creator: userId }, { id_other: userId }]
    })
      .populate('id_creator', 'name username photoURL email')
      .populate('id_other', 'name username photoURL email')
      .sort({ dateCreated: -1 })
      .lean();

    const groupTx = await groupTransaction.find({
      $or: [{ paidBy: userId }, { createdBy: userId }]
    })
      .populate('paidBy', 'name username photoURL email')
      .populate('createdBy', 'name username photoURL email')
      .populate('groupId', 'name photoURL')
      .sort({ date: -1 })
      .lean();

    const formattedContactTx = contactTx.map(tx => {
      const isCreator = tx.id_creator._id.toString() === userId.toString();
      const partyName = isCreator ? tx.id_other.name : tx.id_creator.name;
      const direction = isCreator ? 'Paid' : 'Received';
      const settledStatus = tx.status === 'settled' ? (isCreator ? 'Paid' : 'Received') : tx.status;

      return {
        id: tx._id.toString(),
        party: partyName,
        direction,
        amount: parseFloat(tx.amount || 0).toFixed(2),
        sector: tx.sector || 'Other',
        description: tx.description || 'No description',
        settled: settledStatus,
        dateCreated: tx.dateCreated ? new Date(tx.dateCreated).toISOString().split('T')[0] : 'N/A',
        dueDate: tx.dueDate ? new Date(tx.dueDate).toISOString().split('T')[0] : 'N/A',
        settledDate: tx.dateSettled ? new Date(tx.dateSettled).toISOString().split('T')[0] : 'N/A',
        type: 'contact'
      };
    });

    const formattedGroupTx = groupTx.map(tx => ({
      id: tx._id.toString(),
      party: tx.groupId?.name || tx.party || 'Unknown Group',
      direction: tx.direction || (tx.paidBy._id.toString() === userId.toString() ? 'Paid' : 'Received'),
      amount: parseFloat(tx.amount || 0).toFixed(2),
      sector: tx.sector || 'Other',
      description: tx.description || 'No description',
      settled: tx.settled ? (tx.paidBy._id.toString() === userId.toString() ? 'Paid' : 'Received') : 'Pending',
      dateCreated: tx.date ? new Date(tx.date).toISOString().split('T')[0] : 'N/A',
      dueDate: tx.due ? new Date(tx.due).toISOString().split('T')[0] : 'N/A',
      settledDate: tx.settled ? new Date(tx.updatedAt).toISOString().split('T')[0] : 'N/A',
      type: 'group'
    }));

    const allTx = [...formattedContactTx, ...formattedGroupTx];
    allTx.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));

    const paginatedTx = allTx.slice(skip, skip + limit);

    const total = allTx.length;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      transactions: paginatedTx,
      page,
      totalPages,
      total
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};














export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const contactTx = await contactTransaction.find({
      $or: [{ id_creator: userId }, { id_other: userId }]
    })
      .populate('id_creator', 'name username photoURL email')
      .populate('id_other', 'name username photoURL email')
      .sort({ dateCreated: -1 })
      .lean();

    const groupTx = await groupTransaction.find({
      $or: [{ paidBy: userId }, { createdBy: userId }]
    })
      .populate('paidBy', 'name username photoURL email')
      .populate('createdBy', 'name username photoURL email')
      .populate('groupId', 'name photoURL')
      .sort({ date: -1 })
      .lean();

    let toReceive = 0;
    let toPay = 0;
    const sectorMap = {};

    const formattedContactTx = contactTx.map(tx => {
      const isCreator = tx.id_creator._id.toString() === userId.toString();
      const amount = parseFloat(tx.amount || 0);
      const pending = tx.status !== 'settled';

      if (pending) {
        if (isCreator) toReceive += amount;
        else toPay += amount;
      }

      const sector = tx.sector || 'Other';
      sectorMap[sector] = (sectorMap[sector] || 0) + amount;

      return {
        id: tx._id.toString(),
        date: tx.dateCreated || tx.createdAt,
        description: tx.description || 'No description',
        amount: amount.toFixed(2),
        paidBy: isCreator ? tx.id_creator.name : tx.id_other.name,
        settled: !pending
      };
    });

    const formattedGroupTx = groupTx.map(tx => {
      const paidByUser = tx.paidBy._id.toString() === userId.toString();
      const amount = parseFloat(tx.amount || 0);
      const pending = !tx.settled;

      if (pending) {
        if (paidByUser) toReceive += amount;
        else toPay += amount;
      }

      const sector = tx.sector || 'Other';
      sectorMap[sector] = (sectorMap[sector] || 0) + amount;

      return {
        id: tx._id.toString(),
        date: tx.date || tx.createdAt,
        description: tx.description || 'No description',
        amount: amount.toFixed(2),
        paidBy: tx.paidBy.name,
        settled: !pending
      };
    });

    const allTx = [...formattedContactTx, ...formattedGroupTx]
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    const sectorData = Object.entries(sectorMap).map(([name, value]) => ({
      name,
      value
    }));

    res.status(200).json({
      toReceive,
      toPay,
      net: toReceive - toPay,
      transactions: allTx.slice(0, 6), 
      sector: sectorData
    });

  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const sendReminderForContactTransaction = async (req, res) => {
  try {
    const { amount, id } = req.body;
    const userId = req.user._id;

    const transaction = await contactTransaction.findById(id);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.id_creator.toString() !== userId.toString() && transaction.id_other.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You are not authorized to send a reminder for this transaction" });
    }

    const recipientId = transaction.id_creator.toString() === userId.toString() ? transaction.id_other : transaction.id_creator;
    console.log(`Sending reminder to user ${recipientId} for transaction ${id} of amount ${amount}`);
    const recipient = await users.findById(recipientId);
    const RecipientEmail = recipient.email; 
    const RecipientName = recipient.name;
    const transactionAmt= transaction.amount;
    const transactionId = transaction._id;
    const transactionDescription = transaction.description || 'No description provided';
    const transactionSector = transaction.sector || 'Other';
    const transactionDueDate = transaction.dueDate ? new Date(transaction.dueDate).toISOString().split('T')[0] : 'N/A';
    const sender=await users.findById(userId);
    
    
    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Transaction Reminder</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f7f9fc;
          padding: 20px;
          color: #333;
        }
        .container {
          background-color: #ffffff;
          max-width: 520px;
          margin: auto;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        h1 {
          color: #2563eb;
          font-size: 22px;
          text-align: center;
        }
        p {
          font-size: 15px;
          line-height: 1.5;
        }
        .details {
          margin-top: 15px;
          padding: 15px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          border-radius: 8px;
        }
        .details p {
          margin: 6px 0;
        }
        .cta-btn {
          display: inline-block;
          padding: 12px 20px;
          margin-top: 20px;
          background: linear-gradient(90deg, #2563eb, #1d4ed8);
          color: white;
          font-weight: bold;
          text-decoration: none;
          border-radius: 8px;
        }
        .cta-btn:hover {
          background: linear-gradient(90deg, #1d4ed8, #2563eb);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Friendly Reminder: Pending Transaction</h1>
        <p>Hi ${RecipientName},</p>
        <p>You have a pending transaction on <strong>upSplit</strong> that requires your attention. Here are the details:</p>
        <div class="details">
          <p><strong>Transaction ID:</strong> ${transactionId}</p>
          <p><strong>Amount:</strong> ₹${transactionAmt}</p>
          <p><strong>Description:</strong> ${transactionDescription}</p>
          <p><strong>Sector:</strong> ${transactionSector}</p>
          <p><strong>Due Date:</strong> ${transactionDueDate}</p>
          <p><strong>Other Party:</strong> ${sender.name}</p>
        </div>
        <p>Please review this transaction and take the necessary steps to settle it before the due date.</p>
        <p style="margin-top:20px;">Thank you for using <strong>upSplit</strong> to manage your expenses!</p>
        <p>— The upSplit Team</p>
      </div>
    </body>
    </html>
    `;


    
    scheduleEmail(
      RecipientEmail ,
      "Reminder for Transaction",
     
      htmlBody,
     
      1,
      Date.now()+10
    )



    console.log(`Reminder sent for transaction ${id} of amount ${amount}`);

    res.status(200).json({ message: "Reminder sent successfully" });
  } catch (error) {
    console.error("Error sending reminder:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}