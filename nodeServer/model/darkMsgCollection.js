const mongoose=require('mongoose')

const newschema=new mongoose.Schema({
    sender:{
        type:String,
        required:true
    },
    darkid:{
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
const darkMsgCollection= mongoose.model('darkMsgCollection',newschema)
module.exports=darkMsgCollection