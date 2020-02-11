import * as mongoose from 'mongoose';
import User from './user.interface';

const addressSchema = new mongoose.Schema({
  city: String,
  country: String,
  street: String,
});

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    default: null,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    default: null,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    trim: true,
    // select:false,
  },
  status: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  phone: Number,
  address: addressSchema,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
