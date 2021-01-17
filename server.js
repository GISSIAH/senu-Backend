// importing libraries express, cors and body-parser
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

//initiate the server
const app = express();

//define origin for cross-origin requests which will be made from the web server
var corsOptions = {
    origin: 'https://mw-senu.herokuapp.com',
}
//using the defined cors options
app.use(cors(corsOptions));

//using JSON format in the requests
app.use(bodyParser.json());

//importing the database model for the hospital_records table
const db = require('./models');
//starting the database connection
db.sequelize.sync();

//setting server routes by using the server routes defined in api.js in routes folder
require('./routes/api')(app);

//listening to port on the server, either port 5000 or the port defined on the production server system
app.listen(process.env.PORT || 5000,()=>{
    console.log('listening to port 5000');
});