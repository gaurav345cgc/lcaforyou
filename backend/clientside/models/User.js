const mongoose = require("mongoose");
const passport = require("passport");

const user =new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:false,
    },
    password:{
        type: String,
        required: true,
        private: true,

    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    username:{
        type:String,
        required:true,
    },
});

const UserModel = mongoose.model("User",user);

module.exports = UserModel; 