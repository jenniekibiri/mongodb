const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    role:String
   
},{ collection : 'users' });
module.exports = mongoose.model('User',userSchema);