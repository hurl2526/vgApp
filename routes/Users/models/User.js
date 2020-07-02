const mongoose = require('mongoose')
const moment = require('moment')

const UserSchema = new mongoose.Schema({
  name: {type:String, default:'', required:true},
  userName: {type:String, default:'', required:true},
  email:{type:String, unique:true, lowercase:true, default:'',required:true},
  password:{type:String,default:'',required:true, min: 3},
  timestamp:{type:String,
    default:()=>{
    moment().format('dddd,MMMM Do YYYY, h:mm a');
    }
  }
})

  module.exports = mongoose.model('User', UserSchema)