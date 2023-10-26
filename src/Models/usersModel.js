const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const schema = new Schema(
  {
    name: {
      type: String,
      require: true,
      default: null,
    },
    jobTitle: {
      type: String,
      require: true,
    },
    phoneNumber: {
      type: Number,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    upline: {
      type: mongoose.Schema.Types.ObjectId,
      require: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const userModel = mongoose.model("users", schema);
module.exports = userModel;
