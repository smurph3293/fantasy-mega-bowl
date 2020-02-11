import { User } from './User';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

export let Bet = new Schema({
    users: [{
        ref: User,
        type: Schema.Types.ObjectId,
    }],
    title: {
        type: String,
        trim: true,
        default: null
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    status: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});


module.exports = mongoose.model('Bet', Bet);