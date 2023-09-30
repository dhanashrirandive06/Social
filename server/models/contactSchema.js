const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  followed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

const Contacts = new mongoose.model("Contact", contactSchema);
module.exports = Contacts;
