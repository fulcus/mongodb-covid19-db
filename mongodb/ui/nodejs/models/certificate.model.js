const mongoose = require("mongoose");

// refer to https://mongoosejs.com/docs/geojson.html
const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Point"],
  },
  coordinates: {
    type: [Number],
  },
});

const covidCenterSchema = new mongoose.Schema({
  //id: Number,
  name: String,
  address: String,
  type: String,
  location: pointSchema,
});

const shortPersonSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: String,
  phone_number: String,
});

var certificateSchema = new mongoose.Schema(
  {
    //_id: { type: mongoose.Schema.ObjectId, auto: true },
    person: {
      //_id: { type: mongoose.Schema.ObjectId, auto: true },
      first_name: String,
      last_name: String,
      email: String,
      phone_number: String,
      CF: String,
      is_doctor: Boolean,
      emergency_contact: shortPersonSchema,
    },
    tests: [
      {
        //_id: { type: mongoose.Schema.ObjectId, auto: true },
        outcome: Boolean,
        date: Date,
        covid_center: covidCenterSchema,
        health_worker: shortPersonSchema,
      },
    ],
    vaccines: [
      {
        //_id: { type: mongoose.Schema.ObjectId, auto: true },
        type: String,
        date: Date,
        covid_center: covidCenterSchema,
        health_worker: shortPersonSchema,
      },
    ],
  },
  { collection: "certificates" }
);

mongoose.model("Certificate", certificateSchema);
