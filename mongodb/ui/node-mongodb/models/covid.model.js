const mongoose = require('mongoose');

var certificateSchema = new mongoose.Schema({
    person: {
        type: Object,
        required: 'This field is required'
    },
    tests: {
        type: Object,
        required: 'This field is required'
    },
    vaccines: {
        type: Array,
        required: 'This field is required'
    }
    
});

mongoose.model("Certificate", certificateSchema);

/*
[{
    "person": {
      "id": 1,
      "first_name": "Lorenza",
      "last_name": "Van Halle",
      "email": "lvanhalle0@oakley.com",
      "phone_number": "923-227-5604",
      "CF": "OYWWMH3I28X731D",
      "is_doctor": false,
      "emergency_contact": {
        "first_name": "Brear",
        "last_name": "Crosskell",
        "phone_number": "922-494-3982",
        "email": "bcrosskell3l@163.com"
      }
    },
    "tests": [
      {
        "id": 648,
        "outcome": true,
        "date": "2020-03-25",
        "covid_center": {
          "id": 8,
          "name": "Block Group",
          "address": "93354 Starling Parkway",
          "type": "Vaccination Hub",
          "location": {
            "type": "Point",
            "coordinates": [51.1134675, 28.0490173]
          }
        },
        "health_worker": {
          "first_name": "Scarface",
          "last_name": "Buckthorp",
          "phone_number": "566-530-5428",
          "email": "sbuckthorp9k@nsw.gov.au"
        }
      },
      {
        "id": 345,
        "outcome": false,
        "date": "2020-03-24",
        "covid_center": {
          "id": 2,
          "name": "Rolfson, Mayert and Gottlieb",
          "address": "798 Manley Place",
          "type": "Vaccination Hub",
          "location": {
            "type": "Point",
            "coordinates": [54.4658152, 19.9348453]
          }
        },
        "health_worker": {
          "first_name": "Thalia",
          "last_name": "Garie",
          "phone_number": "383-970-9767",
          "email": "tgarie8l@altervista.org"
        }
      }
    ],
    "vaccines": [
      {
        "id": 453,
        "type": "Moderna",
        "date": "2021-10-26",
        "covid_center": {
          "id": 8,
          "name": "Block Group",
          "address": "93354 Starling Parkway",
          "type": "Vaccination Hub",
          "location": {
            "type": "Point",
            "coordinates": [51.1134675, 28.0490173]
          }
        },
        "health_worker": {
          "first_name": "Jenelle",
          "last_name": "Edwicker",
          "phone_number": "717-339-5387",
          "email": "jedwickere@reference.com"
        }
      },
      {
        "id": 494,
        "type": "Pfizer",
        "date": "2021-10-11",
        "covid_center": {
          "id": 3,
          "name": "Bode Group",
          "address": "687 Vera Way",
          "type": "Pharmacy",
          "location": {
            "type": "Point",
            "coordinates": [38.0120968, 23.7725723]
          }
        },
        "health_worker": {
          "first_name": "Antone",
          "last_name": "Tukely",
          "phone_number": "984-949-1533",
          "email": "atukely3f@istockphoto.com"
        }
      },
      {
        "id": 486,
        "type": "Astrazeneca",
        "date": "2021-06-05",
        "covid_center": {
          "id": 4,
          "name": "Gorczany, Beahan and VonRueden",
          "address": "9747 Kipling Place",
          "type": "Pharmacy",
          "location": {
            "type": "Point",
            "coordinates": [-8.4114856, 116.1713917]
          }
        },
        "health_worker": {
          "first_name": "Deedee",
          "last_name": "Frere",
          "phone_number": "851-191-2826",
          "email": "dfrere3g@yale.edu"
        }
      }
    ]
  }*/