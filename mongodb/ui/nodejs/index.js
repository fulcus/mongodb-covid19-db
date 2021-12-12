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

var app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.redirect("certificate/list");
});

app.set("views", path.join(__dirname, "views"));

var expressHbs = require("express-handlebars");
var hbs = expressHbs.create({
  handlebars: allowInsecurePrototypeAccess(handlebars),
  extname: "hbs",
  defaultLayout: "mainLayout",
  layoutsDir: __dirname + "/views/layouts/",
  helpers: {
    select: function (selected, options) {
      return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
    }
}});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.listen(3000, () => {
  console.log("server started at port 3000");
});

app.use("/certificate", certificateController);
