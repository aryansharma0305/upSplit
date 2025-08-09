import mongoose from "mongoose";

const contactTransactionSchema = new mongoose.Schema({

  id_creator: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

  id_other: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

  share_creator: { type: Number, default: 0, required: true },

  share_other: { type: Number, default: 0, required: true },    
 
  amount: { type: Number, required: true },

  dateCreated: { type: Date, default: Date.now },

  dueDate: { type: Date, required: true },

  dateSettled: { type: Date, default: null },

  description: { type: String, required: true },

  sector: { type: String, required: true },

  status: { type: String, enum: ['pending', 'settled', 'overdue','discarded'], default: 'pending' },



}, { timestamps: true });   


export default mongoose.model("contactTransaction", contactTransactionSchema);