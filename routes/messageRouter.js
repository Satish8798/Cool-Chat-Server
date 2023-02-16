const express = require("express");
const { authorizeUser } = require("../middlewares/authorize");
const { sendMessage, allMessages } = require("../modules/messageModule");

const router = express.Router();

router.post('/',authorizeUser, sendMessage);
router.get('/:chatId', authorizeUser, allMessages);

module.exports = router;