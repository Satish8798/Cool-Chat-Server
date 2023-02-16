const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    picture: {type: String, required: true, 
    default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },
},{
    timestamps: true
});

const userModel = mongoose.model("users",userSchema);

module.exports = userModel;