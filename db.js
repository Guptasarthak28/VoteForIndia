const mongoose = require('mongoose');
require('dotenv').config();
// Define the mongoDB URL
// //Replace the mydatabase with the name of your database
const mongoURL = process.env.MONGODB_URL_LOCAL;
//const mongoURL= process.env.MONGODB_URL;
//Setup mongoDB connection
mongoose.connect(mongoURL,{
useNewUrlParser: true,
    useUnifiedTopology: true
})

//Get the default connection
//Mongoose maintains a default connection object representing the mongoDB connection
const db = mongoose.connection

//define event listeners for database connection
db.on('connected', ()=>{
    console.log('connected to mongoDB server');
});

db.on('error', (err)=>{
    console.error('MongoDB connection error:', err);
});
db.on('disconnected', ()=>{
    console.log(' mongoDB disconnected');
});

//Export the database connection
module.exports = db;