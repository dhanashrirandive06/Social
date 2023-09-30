const mongoose = require("mongoose");
const URL =
  "mongodb+srv://dhanashrirandive06:dhanashrirandive06@cluster0.a3s0tpu.mongodb.net/";

mongoose
  .connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Db connected Successfully");
  })
  .catch((error) => {
    console.log("Error in db connection", error);
  });
