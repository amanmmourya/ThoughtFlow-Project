const mongoose=require('mongoose')

const newschema=new mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    receiver:{
        type:String,
        required:true
    },
    msg:{
        type:String,
        
    },
    time:{
        type:String
    }
    
},{timestamps:true})
const conMsgCollection= mongoose.model('conMsgCollection',newschema)
module.exports=conMsgCollection