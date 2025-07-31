import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

  uid: { type: String , default: "",unique: false },
  
  name: {type: String},
  
  email: { type: String, required: true,unique: true },
  
  photoURL: {type: String },

  dob: { type: String }, // "DD-MM-YYYY"

  upi: { type: String, default: "" },

  username: { type: String},

  password: { type: String, default: "" },

  profileCompleted: { type: Boolean, default: false },
  
  opt: { type: String, default: "" },

  authToken: { type: String, default: "" },

  phoneNumber: { type: String, default: "" },

  isVerified: { type: Boolean, default: false },

  contacts: [{type:mongoose.Schema.Types.ObjectId, ref: 'users', default: [] }],

}, { timestamps: true })

export default mongoose.model("users", userSchema)
