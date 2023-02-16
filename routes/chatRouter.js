const express = require('express');
const { authorizeUser } = require('../middlewares/authorize');
const router = express.Router();
const chatModule = require("../modules/chatModule");

router.post('/',authorizeUser, chatModule.accessChat);
router.get('/',authorizeUser,chatModule.fetchChats);
router.post('/group/create',authorizeUser,chatModule.createGroupChat);
router.put('/group/rename',authorizeUser,chatModule.renameGroup);
router.put("/group/remove",authorizeUser,chatModule.removeFromGroup);
router.put('/group/add',authorizeUser,chatModule.addToGroup);


module.exports = router;