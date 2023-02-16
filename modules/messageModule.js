const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const userModel = require("../models/userModel");

//module for sending a message
module.exports.sendMessage = async (req, res) => {
    const {content, chatId} = req.body

    if(!content || !chatId){
        return res.status(400).send("Invalid Data")
    }

    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        let message = new messageModel(newMessage);
        message = await message.save();

        message = await message.populate("sender","name picture");
        message = await message.populate("chat");
        message = await userModel.populate(message, {
            path: 'chat.users',
            select: "name picture email"
        });

        await chatModel.findByIdAndUpdate(req.body.chatId,{
            latestMessage: message
        });

        res.send(message)
    } catch (error) {
        res.status(400).send(error)
    }
}

//module for getting all messages

module.exports.allMessages = async (req, res) =>{
    try {
        const messages = await messageModel.find({chat: req.params.chatId}).populate('sender','name pic email').populate('chat');

        res.send(messages);
    } catch (error) {
        res.status(400).send(error)
    }
}