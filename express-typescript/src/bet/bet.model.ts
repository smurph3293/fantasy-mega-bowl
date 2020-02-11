import * as mongoose from 'mongoose';
import Bet from './bet.interface';

const betSchema = new mongoose.Schema({
    owner: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    opponents: {
        ref: 'User',
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    title: {
        type: String,
        default: null,
        required: true,
      },
      description: {
        type: String,
        trim: true,
        default: null,
      },
      imageUrl: {
        type: String,
        trim: true,
        // lowercase: true,
      },
      completed: {
        type: Boolean,
        default: false,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
});

const betModel = mongoose.model<Bet & mongoose.Document>('Bet', betSchema);

export default betModel;
