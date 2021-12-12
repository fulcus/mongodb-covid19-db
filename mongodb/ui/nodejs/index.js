require("./models/db");

const express = require("express");
const path = require("path");
const handlebars = require('handlebars');
const { engine } = require("express-handlebars");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const bodyparser = require("body-parser");

const certificateController = require("./controllers/certificateController");
//const testController = require("./controllers/testController");

var app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.redirect("certificate/list");
});

app.set("views", path.join(__dirname, "views"));

app.engine(
  "hbs",
  engine({
    handlebars: allowInsecurePrototypeAccess(handlebars),
    extname: "hbs",
    defaultLayout: "mainLayout",
    layoutsDir: __dirname + "/views/layouts/",
  })
);

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.listen(3000, () => {
  console.log("server started at port 3000");
});

app.use("/certificate", certificateController);
