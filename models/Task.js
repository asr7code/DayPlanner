const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    title:String,
    time:String,
    category:String,

    completed:{
        type:Boolean,
        default:false
    },

    lastResetDate:{
        type:String,
        default:()=>new Date().toDateString()
    }
});

module.exports = mongoose.model("Task", taskSchema);
