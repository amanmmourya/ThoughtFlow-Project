const mongoose = require('mongoose')

const newSchema =new mongoose.Schema({
    adminid:{
        type:String,
        required:true,
        trim:true
    },
    darkid:{
        type:String,
        required:true,
        trim:true
    }
})
const allDark=mongoose.model('allDark',newSchema)
module.exports=allDark