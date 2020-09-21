const mongoose = require('mongoose');
module.exports = mongoose.model('record', new mongoose.Schema({
 id: String,
 FirstName:String,
 LastName:String,
 Email: String,
 PhoneNum:Number,
 DateOfBirth:Date,
 Address:String,
 Age:Number,
 Sex:String,
 DateOfAddmission:Date
}));
