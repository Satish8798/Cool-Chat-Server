const express = require("express");
const { authorizeUser } = require("../middlewares/authorize");
const userModule = require("../modules/userModule")

const router = express.Router();

router.post('/signup',userModule.userSignup);
router.post('/login',userModule.userLogin);
router.get('/',authorizeUser,userModule.getAllUsers);

module.exports = router