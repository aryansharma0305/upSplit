import users from "../models/users.js"; 
import contactTransaction from "../models/contactTransaction.js";



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