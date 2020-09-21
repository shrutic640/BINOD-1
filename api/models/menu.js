const mongoose = require('mongoose');
module.exports = mongoose.model('menu', new mongoose.Schema({
 id: String,
 FoodPreference: String,
 FoodItem: String
}));
