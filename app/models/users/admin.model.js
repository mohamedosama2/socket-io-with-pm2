const mongoose = require("mongoose");
const UserModel = require("./_user.model");

const schema = new mongoose.Schema(
  {
    permissions: {
      type: String,
      enum: ["view", "adding", "all"],
      default: "all",
    },
  },
  { discriminatorKey: "role" }
);
module.exports = UserModel.discriminator("admin", schema);
