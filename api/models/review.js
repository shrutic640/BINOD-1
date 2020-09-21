const mongoose = require('mongoose');
module.exports = mongoose.model('review', new mongoose.Schema({
 id: String,
 NurseName:String,
 review: String,
}));
