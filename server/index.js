const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const PORT = 8000;

// Database Connection
require("./dbConnection");

//Importing Routes
const routes = require("./routes/routes");
const { Connection } = require("mongoose");

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/", routes);

app.listen(PORT, () => {
  console.log("server running on port:", PORT);
});
