const chatModel = require("../models/chatModel");
const userModel = require("../models/userModel");

//module for accessing a specific chat
module.exports.accessChat = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.sendStatus(400);
  }

  let isChat = await chatModel
    .find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");


  isChat = await userModel.populate(isChat, {
    path: "latestMessage.sender",
    select: "name picture email",
  });


  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const chat = new chatModel(chatData);

      const createdChat = await chat.save();

      const fullChat = await chatModel
        .findOne({ _id: createdChat._id })
        .populate("users", "-password");

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
};

//module for fetching all the chats of a user
module.exports.fetchChats = async (req, res) => {
  try {
    let chats = await chatModel
      .find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-passsword")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await userModel.populate(chats, {
      path: "latestMessage.sender",
      select: "name picture email",
    });

    return res.status(200).send(chats);
  } catch (error) {
    res.status(400).send(error);
  }
};

//module for creating a group chat
module.exports.createGroupChat = async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send("Please fill all the fields");
  }
  let users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("Add more than 2 more members to a group");
  }

  users.push(req.user);
  const groupDetails = {
    chatName: req.body.name,
    users,
    isGroupChat: true,
    groupAdmin: req.user,
  };
  try {
    const groupChat = await chatModel(groupDetails);

    const group = await groupChat.save();

    const fullGroupChat = await chatModel
      .findOne({ _id: group._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullGroupChat);
  } catch (error) {
    res.status(400).send(error);
  }
};

//module for renaming a group

module.exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await chatModel
    .findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!updatedChat){
        res.status(400).send("Chat not Found");
    }else{
        res.send(updatedChat);
    }
};

//module for adding to a group
module.exports.addToGroup = async (req,res) => {
    const { chatId , userId } = req.body;
    const added = await chatModel.findByIdAndUpdate(chatId,{
        $push: {users: userId}
    },{
        new : true
    }).populate("users", "-password").populate("groupAdmin", "-password");

    if(!added){
        res.status(400).send("Chat not Found");
    }else{
        res.status(200).send(added);
    }
}

//module for removing from a group
module.exports.removeFromGroup = async (req,res)=>{
    const { chatId , userId } = req.body;
    const added = await chatModel.findByIdAndUpdate(chatId,{
        $pull: {users: userId}
    },{
        new : true
    }).populate("users", "-password").populate("groupAdmin", "-password");

    if(!added){
        res.status(400).send("Chat not Found");
    }else{
        res.status(200).send(added);
    }
}
