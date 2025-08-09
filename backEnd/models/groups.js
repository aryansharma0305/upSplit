import mongoose from 'mongoose'

const groupSchema = new mongoose.Schema({

    name: { type: String, required: true, trim: true, maxlength: [50, 'Group name cannot exceed 50 characters'] },
    
    photoURL: { type: String, default: null },
    
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }],
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

}, { timestamps: true })

export default mongoose.model("groups", groupSchema)







