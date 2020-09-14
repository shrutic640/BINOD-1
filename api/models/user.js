const mongoose = require('mongoose');
module.exports = mongoose.model('User', new mongoose.Schema({
 NurseName: String,
 password: String,
 isAdmin: Boolean
}));