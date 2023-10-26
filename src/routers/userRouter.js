const express = require("express");
const {
  signupUser,
  login,
  getUserList,
  updateUser,
  deleteUser,
  getDownUsers,
} = require("../controller/userController");
const userRouter = express.Router();

userRouter.get("/", (req, res, next) => {
  res.send({
    success: true,
    message: "I'm In User Router",
  });
});
userRouter.post("/signup", signupUser);
userRouter.post("/login", login);
userRouter.get("/registered_users", getUserList);
userRouter.post("/update", updateUser);
userRouter.delete("/delete", deleteUser);
userRouter.get("/get_downline", getDownUsers);

module.exports = userRouter;
