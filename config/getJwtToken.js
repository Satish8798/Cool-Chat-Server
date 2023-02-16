const jwt = require("jsonwebtoken");

function generateJwtToken(user){
    const token = jwt.sign(user,process.env.SECRET_KEY_JWT,{
        expiresIn:"30d",
    } );

    return token;
}

module.exports=generateJwtToken;