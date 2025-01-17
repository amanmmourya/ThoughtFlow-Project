const mongoose = require('mongoose')

const newSchema =new mongoose.Schema({
    
    networkname:{
        type:String,
        required:true,
        trim:true
    },
    networkid:{
        type:String,
        required:true,
        trim:true
    }
})
const allNetwork=mongoose.model('allNetwork',newSchema)
module.exports=allNetwork