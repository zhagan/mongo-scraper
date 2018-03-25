// var mongojs = require("mongojs");
var mongoose = require("mongoose");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected');
});

// If the connection throws an error
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
}); 

module.exports = {
    Article: require("./Article"),
    Note: require("./Note")
};