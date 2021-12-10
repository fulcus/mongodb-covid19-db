const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Certificate = mongoose.model("Certificate");

router.get("/", (req, res) => {
  res.render("certificate/addOrEdit", {
    viewTitle: "Insert Certificate",

  });
});

router.post("/", (req, res) => {
  if (req.body._id == "") {
    insertRecord(req, res);
  } else {
    updateRecord(req, res);
  }
});

function insertRecord(req, res) {
  console.log("req.body: " + JSON.stringify(req.body));

  var certificate = new Certificate({
  person: {
    //id: assigned by mongo
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    CF: req.body.CF,
    is_doctor: req.body.is_doctor === "true" ? true : false,
  }});

  console.log('certificate: ' + JSON.stringify(certificate));

  certificate.save((err, doc) => {
    if (!err) {
      res.redirect("certificate/list");
    } else {
      console.log("Error during insert: " + err);
    }
  });
}

function updateRecord(req, res) {
  console.log('update record: ' + JSON.stringify(req.body));
  Certificate.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("certificate/list");
      } else {
        console.log("Error during update: " + err);
      }
    }
  );
}

router.get("/list", (req, res) => {
  Certificate.find((err, docs) => {
    if (!err) {
      res.render("certificate/list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieval: " + err);
    }
  });
});

router.get("/:id", (req, res) => {
  Certificate.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("certificate/addOrEdit", {
        viewTitle: "Update Certificate",
        certificate: doc,
      });
      console.log(doc);
    }
  });
});

router.get("/delete/:id", (req, res) => {  
  Certificate.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/certificate/list");
    } else {
      console.log("Error in deletion: " + err);
    }
  });
});

module.exports = router;
