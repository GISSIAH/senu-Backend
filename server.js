const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
//const PORT = process.env.port||4000;
const app = express();
var corsOptions = {
    origin: 'https://senu-front.herokuapp.com'
}
app.use(cors(corsOptions));
app.use(bodyParser.json());
const db = require('./models');
db.sequelize.sync();
require('./routes/api')(app);
app.listen(process.env.PORT || 5000,()=>{
    console.log('listening to port 5000');
});
  