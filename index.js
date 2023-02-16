const express = require("express");
const dotenv = require("dotenv");
const dbConnection = require("./dbConnection");
const userRouter = require("./routes/userRouter");
const chatRouter = require("./routes/chatRouter");
const messageRouter = require("./routes/messageRouter");

const cors = require("cors");

dotenv.config();

dbConnection.connect();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("api is running");
});

app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

const server = app.listen(process.env.PORT, () => {
  console.log("server running at port" + process.env.PORT);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://cool-chat-cc.netlify.app/",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log("user joined room: "+ room)
  })

  socket.on('typing', (room)=>{
    socket.in(room).emit("typing")
  });

  socket.on('stop typing', (room)=>{
    socket.in(room).emit("stop typing")
  });

  socket.on('new message',(newMessageRecieved)=>{
    let chat = newMessageRecieved.chat;
    if(!chat.users) return console.log('chat.users not defined');

    chat.users.forEach(user=>{
        if(user._id === newMessageRecieved.sender._id) return;
        socket.in(user._id).emit("message recieved", newMessageRecieved)
    });

  });

  socket.off('setup',()=>{
    console.log('user disconnected');
    socket.leave(userData._id);
  })
});
