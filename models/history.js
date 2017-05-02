var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HistoryM = new Schema({
    username: String,
    title: String,
    text: String,
    likes: Number,
    fires: Number,
    date: {type: Date, default: Date.now}
});

//HistoryM.plugin(passportLocalMongoose);

module.exports = mongoose.model('HistoryM', HistoryM);