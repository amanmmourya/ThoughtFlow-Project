const mongoose=require('mongoose')

const newschema=new mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    networkid:{
        type:String,
        required:true,
        trim:true
    },
    msg:{
        type:String
        
    },
    time:{
        type:String
    }
    
},{timestamps:true})
const netMsgCollection= mongoose.model('netMsgCollection',newschema)
module.exports=netMsgCollection