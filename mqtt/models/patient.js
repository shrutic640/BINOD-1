const mongoose = require('mongoose');
module.exports = mongoose.model('patient', new mongoose.Schema({
 id: String,
 NurseName:String,
 MedicareNumber: String,
 PatientName:String,
 RoomNumber: String,
 RoomData: Array
}));
