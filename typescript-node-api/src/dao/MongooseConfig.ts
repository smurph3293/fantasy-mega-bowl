var mongoose = require('mongoose');
mongoose.set('debug', true);
var mConfig = require("../utilities/config").config;

module.exports = function() {
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(mConfig.DB_URL.url, { useNewUrlParser: true });
    require('../model/User');
    require('../model/Bet');
    return db;
};