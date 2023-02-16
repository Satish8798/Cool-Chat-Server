const userModel = require("../models/userModel");
const generateJwtToken = require("../config/getJwtToken");
const bcrypt = require("bcrypt");

//signup module
module.exports.userSignup = async (req, res) => {
  const { name, email, password, confirmPassword, pic } = req.body;
  try {
    if (!name || !email || !password || !confirmPassword) {
      throw new Error("please enter all the fields");
    }

    const userExists = await userModel.findOne({ email });

    if (userExists) {
      throw new Error("User already exists");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords deos not match");
    }

    const randomString = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, randomString);

    let userdetails = null;

    if (pic) {
      userdetails = {
        name,
        email,
        password: hashedPassword,
        picture: pic,
      };
    } else {
      userdetails = {
        name,
        email,
        password: hashedPassword,
      };
    }

    const user = new userModel(userdetails);

    const savedUser = await user.save();

    if (savedUser) {
      res.status(200).send({
        token: generateJwtToken({ name: user.name, _id: user._id }),
        user: {
          name: user.name,
          email: user.email,
          picture: user.picture,
          _id: user._id
        },
      });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//login module
module.exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (user) {
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (!passwordMatched) {
        throw new Error("Invalid Password");
      }
      res.status(200).send({
        token: generateJwtToken({ name: user.name, _id: user._id }),
        user: {
          name: user.name,
          email: user.email,
          picture: user.picture,
          _id: user._id
        },
      });
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

//module for getting all users

module.exports.getAllUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { eamil: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await userModel.find(keyword)
  .find({ _id: { $ne: req.user._id } });
  res.send(users);
};
