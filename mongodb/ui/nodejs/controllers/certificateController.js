const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Certificate = mongoose.model("Certificate");

// CERTIFICATES

// Add certificate
router.get("/", (req, res) => {
  res.render("certificate/addOrEdit", {
    viewTitle: "Insert Certificate",
  });
});

// Add certificate post
router.post("/", (req, res) => {
  if (req.body._id == "") {
    insertRecord(req, res);
  } else {
    updatePerson(req, res);
  }
});

function insertRecord(req, res) {
  console.log("req.body: " + JSON.stringify(req.body));

  var certificate = new Certificate({
    person: {
      //_id: assigned by mongo
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      phone_number: req.body.phone_number,
      CF: req.body.CF,
      is_doctor: req.body.is_doctor === "true" ? true : false,
      emergency_contact: {
        first_name: req.body.emergency_first_name,
        last_name: req.body.emergency_last_name,
        email: req.body.emergency_email,
        phone_number: req.body.emergency_phone_number,
      },
    },
  });

  console.log("certificate: " + JSON.stringify(certificate));

  certificate.save((err, doc) => {
    if (!err) {
      res.redirect("certificate/list");
    } else {
      console.log("Error during insert: " + err);
    }
  });
}

function updatePerson(req, res) {
  console.log("update record: " + JSON.stringify(req.body));

  var updated_person = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    CF: req.body.CF,
    is_doctor: req.body.is_doctor === "true" ? true : false,
    emergency_contact: {
      first_name: req.body.emergency_first_name,
      last_name: req.body.emergency_last_name,
      email: req.body.emergency_email,
      phone_number: req.body.emergency_phone_number,
    },
  };

  Certificate.findOneAndUpdate(
    { _id: req.body._id },
    {
      person: updated_person,
    },
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

// Show certificates
router.get("/list", (req, res) => {
  Certificate.find((err, docs) => {
    if (!err) {
      console.log("docs: " + docs);

      res.render("certificate/list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieval: " + err);
    }
  });
});

// Update certificate
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

// Delete certificate
router.get("/:id/delete", (req, res) => {
  Certificate.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("certificate/list");
    } else {
      console.log("Error in deletion: " + err);
    }
  });
});


// TESTS

// Show tests
router.get("/:id/tests", (req, res) => {
  Certificate.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.render("certificate/tests", {
        tests: docs,
      });
    } else {
      console.log("Error in retrieval: " + err);
    }
  });
});

// Add test
router.get("/:id/testsAddOrEdit", (req, res) => {
  Certificate.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("certificate/testsAddOrEdit", {
        viewTitle: "Add Test",
        testsAddOrEdit: doc,
      });
    }else {
        console.log("Error in deletion: " + err);
    }
  });
});


// VACCINES

// Show vaccines
router.get("/:id/vaccines", (req, res) => {
  Certificate.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.render("certificate/vaccines", {
        vaccines: docs,
      });
    } else {
      console.log("Error in retrieval: " + err);
    }
  });
});

// Add vaccine
router.get("/:id/vaccinesAddOrEdit", (req, res) => {
  Certificate.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("certificate/vaccinesAddOrEdit", {
        viewTitle: "Add Vaccine",
        vaccinesAddOrEdit: doc,
      });
    }else {
        console.log("Error in deletion: " + err);
    }
  });
});


/*
//DELETE TESTS: da aggiustare

router.get("/:id/tests/delete", (req, res) => {
  Certificate.updateOne( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } }, (err, doc) => {
    if (!err) {
      res.redirect("/certificate/tests");
    } else {
      console.log("Error in deletion: " + err);
    }
  });
});*/

/*
//DELETE VACCINES: da aggiustare

router.get("/:id/vaccines/delete", (req, res) => {
  Certificate.updateOne( {cn: req.params.name}, { $pullAll: {uid: [req.params.deleteUid] } }, (err, doc) => {
    if (!err) {
      res.redirect("/certificate/vaccines");
    } else {
      console.log("Error in deletion: " + err);
    }
  });
});*/
///////////////////////////

module.exports = router;
