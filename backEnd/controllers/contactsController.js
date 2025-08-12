import users from "../models/users.js"; 
import contactTransaction from "../models/contactTransaction.js";
import mongoose from "mongoose";


 export const isContact = async (req, res) => {
  const userId = req.user._id;
  const contactId = req.query.q;

  if (!contactId) {
    return res.status(400).json({ error: "Contact ID is required" });
  }

  try {
    const user = await users.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isContact = user.contacts.some(contact => contact.toString() === contactId);
    
    res.status(200).json({ isContact });
  } catch (error) {
    console.error("Error checking contact:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}



export const addTransaction = async (req, res) => {
  const { id_other, amount, dueDate, description, sector, share_creator, share_other } = req.body;
  const id_creator = req.user._id;

  if (!id_other || !amount || !dueDate || !description || !sector) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newTransaction = new contactTransaction({
      id_creator,
      id_other,
      amount,
      dueDate,
      description,
      sector,
      share_creator,
      share_other,
    });

    await newTransaction.save();
    res.status(201).json({ message: "Transaction added successfully", transaction: newTransaction });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}




export const getTransactionsWithUser = async (req, res) => {
    const userId = req.user._id;
    const contactId = req.query.q;
    
    if (!contactId) {
        return res.status(400).json({ error: "Contact ID is required" });
    }
    
    try {
       const transactions = await contactTransaction.find({
            $and: [
                {
                    $or: [
                        { id_creator: userId, id_other: contactId },
                        { id_creator: contactId, id_other: userId }
                    ]
                },
                { status: "pending" }
            ]
        });
    
        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}                                                               




export const settleUpTransaction = async (req, res) => {
  const { transactionId} = req.body;
  const userId = req.user._id;

  if (!transactionId ) {
    return res.status(400).json({ error: "Transaction ID  required" });
  }

  try {
    const transaction = await contactTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }  
  
    if (transaction.status !== "pending") {
      return res.status(400).json({ error: "Transaction is not pending" });
    }
    transaction.status = "settled";
    transaction.dateSettled = new Date();
    await transaction.save();
    res.status(200).json({ message: "Transaction settled successfully", transaction });
    } catch (error) {   
    console.error("Error settling transaction:", error);
    res.status(500).json({ error: "Internal server error" });
    }
}



export const  discardTransaction = async (req, res) => {
  const { transactionId } = req.body;
  const userId = req.user._id;

  if (!transactionId) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  try {
    const transaction = await contactTransaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }   
    if (transaction.status !== "pending") {
      return res.status(400).json({ error: "Transaction is not pending" });
    }
    transaction.status = "discarded";
    await transaction.save();
    res.status(200).json({ message: "Transaction discarded successfully", transaction });
    } catch (error) {
    console.error("Error discarding transaction:", error);
    res.status(500).json({ error: "Internal server error" });
    }
}



export const getAllTransactionsWithUser = async (req, res) => {
  const userId = req.user._id;
  const contactId = req.query.q;

  if (!contactId) {
    return res.status(400).json({ error: "Contact ID is required" });
  }

  try {
    const transactions = await contactTransaction.find({
      $or: [
        { id_creator: userId, id_other: contactId },
        { id_creator: contactId, id_other: userId },
      ],
      status: { $ne: "pending" } ,
    }).sort({ dateCreated: -1 }); // Sort by dateCreated descending

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching all transactions:", error);
    res.status(200).json([]);
  }
};








export const getMonthlyAnalytics = async (req, res) => {
  const userId = req.user._id; 
  const contactId = req.query.q; 

  if (!contactId) {
    return res.status(400).json({ error: "Contact ID is required" });
  }

  try {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const contactObjectId = new mongoose.Types.ObjectId(contactId);

    const analytics = await contactTransaction.aggregate([
      {
        $match: {
          $or: [
            { id_creator: userObjectId, id_other: contactObjectId },
            { id_creator: contactObjectId, id_other: userObjectId },
          ],
          status: { $nin: ["settled", "discarded"] }, 
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$dateCreated" },
            year: { $year: "$dateCreated" },
          },
          owe: {
            $sum: {
              $cond: [
                { $eq: ["$id_creator", contactObjectId] },
                "$share_other", 
                0,
              ],
            },
          },
          toReceive: {
            $sum: {
              $cond: [
                { $eq: ["$id_creator", userObjectId] },
                "$share_other", 
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          month: {
            $arrayElemAt: [
              [
                "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
              ],
              "$_id.month",
            ],
          },
          owe: 1,
          toReceive: 1,
          year: "$_id.year",
        },
      },
      {
        $sort: { year: -1, "_id.month": -1 },
      },
      {
        $limit: 6,
      },
    ]);

    res.status(200).json(analytics.reverse()); 
  } catch (error) {
    console.error("Error fetching monthly analytics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};









export const getAllContacts = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await users.findById(userId).select("contacts");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const transactions = await contactTransaction.find({
      $or: [
        { id_creator: userId },
        { id_other: userId },
      ],
      status: "pending",
    }).sort({ updatedAt: -1 }); 
    const contactIds = [
      ...new Set([
        ...user.contacts.map(id => id.toString()),
        ...transactions.flatMap(txn => [
          txn.id_creator.toString(),
          txn.id_other.toString(),
        ]),
      ]),
    ].filter(id => id !== userId.toString());

    const contacts = await users.find({
      _id: { $in: contactIds.map(id => new mongoose.Types.ObjectId(id)) },
    }).select("name email phoneNumber photoURL upi notes username");

    const contactData = contacts.map(contact => {
      const transactionsWithContact = transactions.filter(
        txn =>
          txn.id_creator.toString() === contact._id.toString() ||
          txn.id_other.toString() === contact._id.toString()
      );

      const summary = transactionsWithContact.reduce(
        (acc, txn) => {
          if (txn.status !== "settled") {
            if (txn.id_creator.toString() === contact._id.toString()) {
              acc.owe += parseFloat(txn.share_other || 0);
            } else {
              acc.toReceive += parseFloat(txn.share_other || 0);
            }
          }
          return acc;
        },
        { owe: 0, toReceive: 0 }
      );

      const lastTransactionDate = transactionsWithContact.length
        ? new Date(Math.max(...transactionsWithContact.map(txn => new Date(txn.updatedAt || txn.createdAt))))
        : null;

      return {
        id: contact._id.toString(),
        name: contact.name,
        email: contact.email,
        phone: contact.phoneNumber || "...",
        profilePic: contact.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg",
        owe: summary.owe,
        toReceive: summary.toReceive,
        notes: contact.notes || "",
        username: contact.username,
        lastTransactionDate
      };
    });

    contactData.sort((a, b) => {
      if (!a.lastTransactionDate && !b.lastTransactionDate) return 0;
      if (!a.lastTransactionDate) return 1;
      if (!b.lastTransactionDate) return -1;
      return b.lastTransactionDate - a.lastTransactionDate;
    });

    res.status(200).json(contactData);
  } catch (error) {
    console.error("Error fetching all contacts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
