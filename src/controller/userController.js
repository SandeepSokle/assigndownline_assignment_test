const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const userModel = require("../Models/usersModel");

const getUsers = (res, req, next) => {
  req.send({
    success: true,
    message: "in root Router!",
  });
};

const signupUser = async (req, res, next) => {
  const { name, jobTitle, phoneNumber, email, password, upline } = req.body;
  try {
    let pass = await bcrypt.hash(password, saltRounds);
    console.log({ pass });
    console.log({ ...req.body });

    var token = jwt.sign(
      { name, jobTitle, phoneNumber, email, password, upline },
      "shhhhh"
    );

    const user = await userModel.create([
      {
        ...req.body,
        password: pass,
      },
    ]);

    //   jwt.verify(token, 'shhhhh', function(err, decoded) {
    //     console.log(decoded.foo) // bar
    //   });

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
    console.log({ ...req.body });

    const user = await userModel.findOne({
      email: email,
    });

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
      },
      "shhhhh"
    );

    const userDownlineList = await userModel.find({
      upline: user._id,
    });

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

module.exports = { getUsers, signupUser, login };
