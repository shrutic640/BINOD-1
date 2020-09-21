const mongoose = require('mongoose');
module.exports = mongoose.model('profile', new mongoose.Schema({
 id: String,
 NurseName:String,
 FirstName:String,
 LastName:String,
 Email: String,
 PhoneNum:Number,
 EmployType: String,
 DateOfBirth:Date
}));
