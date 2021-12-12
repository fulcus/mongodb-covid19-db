const mongoose = require('mongoose');

// var uri = 'mongodb+srv://alicebrugnoli:progettobello@projectsmbud.2grxs.mongodb.net/ProjectSMBUD'
var uri = 'mongodb+srv://alicebrugnoli:progettobello@projectsmbud.2grxs.mongodb.net/ProjectSMBUD'

mongoose.connect(uri, {
    useNewUrlParser: true
},
err => {
    if (!err) {
        console.log('Connection succeeded')
    } else {
        console.log('Error in connection: ' + err)
    }
});

require('./certificate.model')