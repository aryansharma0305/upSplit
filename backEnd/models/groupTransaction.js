/*
{
    "title": "djfsf",
    "amount": "122.00",
    "description": "Smeth",
    "split": "absolute",
    "paidBy": "6896534aa36863c4c0ef57fc",
    "sector": "Travel",
    "due": "2025-08-16T21:21:36.537Z",
    "memberShares": {
        "68973a0d8c3cf89c98169709": {
            "amount": "30.50",
            "paid": false
        },
        "6896534aa36863c4c0ef57fc": {
            "amount": "30.50",
            "paid": true
        },
        "6896561535086b16bda47280": {
            "amount": "30.50",
            "paid": false
        },
        "6888b6d7e5a1ca11dc37cc4c": {
            "amount": "30.50",
            "paid": false
        }
    },
    "date": "2025-08-09T21:22:16.268Z",
    "settled": false,
    "direction": "To Pay",
    "party": "Bonthu, Neha Kapoor, Tanvi Bansal, Tanu"
}

*/



import mongoose from 'mongoose'

const groupTransactionSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxlength: [100, 'Title cannot exceed 100 characters'] },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true, maxlength: [500, 'Description cannot exceed 500 characters'] },
    split: { type: String, enum: ['absolute', 'equal'], required: true },
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    sector: { type: String, trim: true, maxlength: [50, 'Sector cannot exceed 50 characters'] },
    due: { type: Date, required: true },
    memberShares: {
        type: Map,
        of: new mongoose.Schema({
        amount: { type: Number, required: true, min: 0 },
        paid: { type: Boolean, default: false }
        })
    },
    date: { type: Date, default: Date.now },
    settled: { type: Boolean, default: false },   
    direction: { type: String, enum: ['To Pay', 'To Receive'], required: true },
    party: { type: String, required: true, trim: true, maxlength: [200, 'Party cannot exceed 200 characters'] },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'groups', required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
}, { timestamps: true });



export default mongoose.model("groupTransactions", groupTransactionSchema);