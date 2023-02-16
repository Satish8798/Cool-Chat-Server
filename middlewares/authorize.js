const jwt= require("jsonwebtoken");
const userModel = require("../models/userModel");

module.exports.authorizeUser = async (req,res,next) =>{
    if(!req.headers["access-token"]){
        return res.status(400).send({
            msg:"Token not found"
        });
    }

    try{
        const user= jwt.verify(req.headers["access-token"],process.env.SECRET_KEY_JWT);
        req.user = await userModel.findById(user._id).select("-password");
        next();
    } catch(error){
        return res.status(400).send({
            msg: "Invalid Token"
        });
    }
}