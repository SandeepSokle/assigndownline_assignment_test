const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const userModel = require("../Models/usersModel");

const signupUser = async (req, res, next) => {
  const { name, jobTitle, phoneNumber, email, password, upline } = req.body;
  try {
    let pass = await bcrypt.hash(password, saltRounds);
    const user = await userModel.create({
      ...req.body,
      password: pass,
    });

    var token = jwt.sign(
      {
        name,
        jobTitle,
        phoneNumber,
        email,
        password,
        upline,
        _id: user._id,
      },
      "shhhhh"
    );

    res.status(200).send({
      success: true,
      message: "in root Router!",
      response: { user, token },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "error in signup",
      error: err,
    });
  }
};

const login = async (req, res, next) => {
  const { phoneNumber, email, password } = req.body;
  try {
    const user = await userModel.findOne({
      email: email,
    });

    if (!user) throw "User Not exist!";

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw "User Email and Password Not Match!";

    var token = jwt.sign(
      {
        name: user.name,
        jobTitle: user.jobTitle,
        phoneNumber: user.phoneNumber,
        email: user.email,
        password: user.password,
        upline: user.upline,
        _id: user._id,
      },
      "shhhhh"
    );

    const userDownlineList = await userModel
      .find({
        upline: user._id,
      })
      .select("name jobTitle phoneNumber email");

    res.status(200).send({
      success: true,
      message: "Login!",
      response: { user, token, userDownlineList },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Login failed",
      error: err,
    });
  }
};

const getUserList = async (req, res, next) => {
  try {
    const users = await userModel
      .find()
      .select("name jobTitle phoneNumber email");

    res.status(200).send({
      success: true,
      message: "Get Users List!",
      response: { users, count: users.length },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Users List fetch failed",
      error: err,
    });
  }
};

const updateUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    let pass = null;
    if (password) {
      pass = await bcrypt.hash(password, saltRounds);
    }

    let my_data = pass
      ? {
          ...req.body,
          password: pass,
        }
      : {
          ...req.body,
        };

    delete my_data.email;

    const user = await userModel.findOneAndUpdate(
      {
        email: email,
      },
      {
        ...my_data,
      },
      {
        new: true,
      }
    );

    if (!user) throw "User Not exist with this Email! Please Verify!";

    res.status(200).send({
      success: true,
      message: "Update User Successfully!",
      response: { user },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Update user failed!",
      error: err,
    });
  }
};

const deleteUser = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOneAndRemove({
      email: email,
    });

    if (!user) throw "User Not exist with this Email! Please Verify!";

    res.status(200).send({
      success: true,
      message: "Delete User Successfully!",
      //   response: { user },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Delete user failed!",
      error: err,
    });
  }
};

const getDownUsers = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    let myToken = token.split(" ")[1];
    let myData = jwt.verify(myToken, "shhhhh");

    const userDownlineList = await userModel
      .find({
        upline: myData._id,
      })
      .select("name jobTitle phoneNumber email");

    res.status(200).send({
      success: true,
      message: "Login!",
      response: myData._id ? { userDownlineList } : { userDownlineList: [] },
    });
  } catch (err) {
    res.status(400).send({
      success: false,
      message: "Login failed",
      error: err,
    });
  }
};

module.exports = {
  signupUser,
  login,
  getUserList,
  updateUser,
  deleteUser,
  getDownUsers,
};
