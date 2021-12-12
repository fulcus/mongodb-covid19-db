const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const Certificate = mongoose.model("Certificate");
const moment = require("moment");

// CERTIFICATES

// Add certificate
router.get("/", (req, res) => {
  res.render("certificate/addOrEdit", {
    viewTitle: "Insert Certificate",
  });
});

// POST: Add or edit certificate
router.post("/", (req, res) => {
  if (req.body._id == "") {
    insertPerson(req, res);
  } else {
    updatePerson(req, res);
  }
});

function insertPerson(req, res) {
  // console.log("req.body: " + JSON.stringify(req.body));

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
  // console.log("certificate: " + JSON.stringify(certificate));

  certificate.save((err, doc) => {
    if (!err) {
      res.redirect("certificate/list");
    } else {
      console.log("Error during insert: " + err);
    }
  });
}

function updatePerson(req, res) {
  // console.log("update record: " + JSON.stringify(req.body));

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
      res.render("certificate/list", {
        list: docs,
      });
    } else {
      console.log("Error in retrieval: " + err);
    }
  });
});

// Edit certificate
router.get("/:id", (req, res) => {
  Certificate.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("certificate/addOrEdit", {
        viewTitle: "Update Certificate",
        certificate: doc,
      });
      // console.log(doc);
    }
  });
});

// Delete certificate
router.get("/:id/delete", (req, res) => {
  Certificate.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/certificate/list");
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
        tests: docs.tests,
        cert_id: req.params.id,
      });
    } else {
      console.log("Error in retrieval: " + err);
    }
  });
});


// Add test
router.get("/:id/testsAddOrEdit", (req, res) => {
  res.render("certificate/testsAddOrEdit", {
    viewTitle: "Add Test",
    cert_id: req.params.id,
  });
});

// Edit test
router.get("/:cert_id/testsAddOrEdit/:test_id", (req, res) => {
  Certificate.findOne({
    _id: req.params.cert_id,
    tests: { $elemMatch: { _id: req.params.test_id } }
  }, (err, doc) => {
    if (!err) {
      try {
        var test = doc.tests.find(t => t._id == req.params.test_id)
      } catch (error) {
        console.log("Error in finding test: " + error);
      }
      const formattedDate = moment(test.date).format("YYYY-MM-DDTHH:mm");


      res.render("certificate/testsAddOrEdit", {
        viewTitle: "Update Test",
        cert_id: req.params.cert_id,
        test: test,
        date: formattedDate
      });
    }
  });
});



// POST: add or edit test
router.post("/:cert_id/test", (req, res) => {
  // console.log("POST req.body: " + JSON.stringify(req.body));
  if (req.body._id == "") {
    insertTest(req, res);
  } else {
    updateTest(req, res);
  }
});

function insertTest(req, res) {
  const formattedDate = moment(req.body.date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  var test = {
    outcome: req.body.outcome === "true" ? true : false,
    date: formattedDate,
    covid_center: {
      name: req.body.covid_center_name,
      address: req.body.covid_center_address,
      center_type: req.body.covid_center_type,
      location: {
        type: "Point",
        coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
      }
  },
    health_worker: {
      first_name: req.body.worker_first_name,
      last_name: req.body.worker_last_name,
      email: req.body.worker_email,
      phone_number: req.body.worker_phone_number,
    }
  }

  // find certificate
  console.log("cert_id: " + req.params.cert_id);

  Certificate.findOneAndUpdate(
    { _id: req.params.cert_id }, { $push: { tests: test } }, { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("/certificate/" + req.params.cert_id + "/tests");
      } else {
        console.log("Error during insert: " + err);
      }
    }
  );
}

function updateTest(req, res) {

  Certificate.findOneAndUpdate(
    { _id: req.params.cert_id, tests: { $elemMatch: { _id: req.body._id } } }, {
    $set:
    {
      'tests.$.outcome': req.body.outcome === "true" ? true : false,
      'tests.$.date': req.body.date,
      'tests.$.covid_center': {
        name: req.body.covid_center_name,
        address: req.body.covid_center_address,
        center_type: req.body.covid_center_type,
        location: {
          type: "Point",
          coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
        }
      },
      'tests.$.health_worker': {
        first_name: req.body.worker_first_name,
        last_name: req.body.worker_last_name,
        email: req.body.worker_email,
        phone_number: req.body.worker_phone_number,
      }
    }
  }, { new: true },
    (err, doc) => {
      if (!err) {
        console.log("Updated test: " + (doc.tests[0]));
        res.redirect("/certificate/" + req.params.cert_id + "/tests");
      } else {
        console.log("Error during insert: " + err);
      }
    }
  );
}

// Delete test
router.get("/:cert_id/test/:test_id/delete", (req, res) => {

  Certificate.findOneAndUpdate(
    { _id: req.params.cert_id }, {
    $pull: {
      tests: { _id: req.params.test_id }
    }
  },
    (err, doc) => {
      if (!err) {
        res.redirect("/certificate/" + req.params.cert_id + "/tests");
      } else {
        console.log("Error during insert: " + err);
      }
    }
  );
});


// VACCINES

// Show vaccines
router.get("/:id/vaccines", (req, res) => {
  Certificate.findById(req.params.id, (err, docs) => {
    if (!err) {
      res.render("certificate/vaccines", {
        vaccines: docs.vaccines,
        cert_id: req.params.id,
      });
    } else {
      console.log("Error in retrieval: " + err);
    }
  });
});

// Add vaccine
router.get("/:id/vaccinesAddOrEdit", (req, res) => {
  res.render("certificate/vaccinesAddOrEdit", {
    viewTitle: "Add Vaccine",
    cert_id: req.params.id,
  });
});

// Edit vaccine
router.get("/:cert_id/vaccinesAddOrEdit/:vaccine_id", (req, res) => {
  Certificate.findOne({
    _id: req.params.cert_id,
    vaccines: { $elemMatch: { _id: req.params.vaccine_id } }
  }, (err, doc) => {
    if (!err) {
      try {
        var vaccine = doc.vaccines.find(t => t._id == req.params.vaccine_id)
      } catch (error) {
        console.log("Error in finding test: " + error);
      }
      const formattedDate = moment(vaccine.date).format("YYYY-MM-DDTHH:mm");
      console.log(formattedDate);

      res.render("certificate/vaccinesAddOrEdit", {
        viewTitle: "Update Vaccine",
        cert_id: req.params.cert_id,
        vaccine: vaccine,
        date: formattedDate
      });
    }
  });
});

// POST: add or edit vaccine
router.post("/:cert_id/vaccine", (req, res) => {
  console.log("POST req.body: " + JSON.stringify(req.body));
  if (req.body._id == "") {
    insertVaccine(req, res);
  } else {
    updateVaccine(req, res);
  }
});

function insertVaccine(req, res) {
  const formattedDate = moment(req.body.date).format("YYYY-MM-DDTHH:mm:ss.SSSZ");

  var vaccine = {
    brand: req.body.brand,
    date: formattedDate,
    covid_center: {
      name: req.body.covid_center_name,
      address: req.body.covid_center_address,
      center_type: req.body.covid_center_type,
      location: {
        type: "Point",
        coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
      }
    },
    health_worker: {
      first_name: req.body.worker_first_name,
      last_name: req.body.worker_last_name,
      email: req.body.worker_email,
      phone_number: req.body.worker_phone_number,
    }
  }

  // find certificate
  console.log("insert : " + JSON.stringify(vaccine, null, 2));

  Certificate.findOneAndUpdate(
    { _id: req.params.cert_id }, { $push: { vaccines: vaccine } }, { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("/certificate/" + req.params.cert_id + "/vaccines");
      } else {
        console.log("Error during insert: " + err);
      }
    }
  );
}

function updateVaccine(req, res) {
  console.log("req.params.cert_id: " + req.params.cert_id);
  console.log("req.body._id: " + req.body._id);

  console.log("req.body: " + JSON.stringify(req.body, null, 2));

  Certificate.findOneAndUpdate(
    { _id: req.params.cert_id, vaccines: { $elemMatch: { _id: req.body._id } } }, {
    $set:
    {
      'vaccines.$.brand': req.body.brand,
      'vaccines.$.date': req.body.date,
      'vaccines.$.covid_center': {
        name: req.body.covid_center_name,
        address: req.body.covid_center_address,
        center_type: req.body.covid_center_type,
        location: {
          type: "Point",
          coordinates: [parseFloat(req.body.lat), parseFloat(req.body.lng)]
        }
      },
      'vaccines.$.health_worker': {
        first_name: req.body.worker_first_name,
        last_name: req.body.worker_last_name,
        email: req.body.worker_email,
        phone_number: req.body.worker_phone_number,
      }
    }
  }, (err, doc) => {
    if (!err) {
      res.redirect("/certificate/" + req.params.cert_id + "/vaccines");
    } else {
      console.log("Error during insert: " + err);
    }
  });
}

// Delete vaccine
router.get("/:cert_id/vaccine/:vaccine_id/delete", (req, res) => {

  Certificate.findOneAndUpdate(
    { _id: req.params.cert_id }, {
    $pull: {
      vaccines: { _id: req.params.vaccine_id }
    }
  },
    (err, doc) => {
      if (!err) {
        res.redirect("/certificate/" + req.params.cert_id + "/vaccines");
      } else {
        console.log("Error during insert: " + err);
      }
    }
  );
});


module.exports = router;
