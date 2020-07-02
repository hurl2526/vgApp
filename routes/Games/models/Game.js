const mongoose = require('mongoose')
const moment = require('moment')

const GameSchema = new mongoose.Schema({
  title: {type:String, required:true,lowercase:true,unique:true},
  description:{type:String, unique:true, lowercase:true,required:true,trim:true },
  yearReleased:{type:Number, required:true,lowercase:true},
  playTime:{type:Number, required:true,lowercase:true},
  Image:{type:Image, required:true},
  timestamp:{type:String,
    default:()=>{
    moment().format('dddd,MMMM Do YYYY, h:mm a');
    }
  }
})

  module.exports = mongoose.model('Game', GameSchema)