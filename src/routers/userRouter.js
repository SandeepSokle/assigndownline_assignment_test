const express = require("express");
const { getUsers, signupUser, login } = require("../controller/userController");
const userRouter = express.Router();

userRouter.get("/", getUsers);
userRouter.post("/signup", signupUser);
userRouter.post("/login", login);

module.exports = userRouter;
