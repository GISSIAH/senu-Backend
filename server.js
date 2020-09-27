const express = require('express');

const cors = require('cors');
const bodyParser = require('body-parser');
//const PORT = process.env.port||4000;
const app = express();



app.use(cors());
app.use(bodyParser.json());

const db = require('./models');
db.sequelize.sync();

require('./routes/api')(app);
app.listen(process.env.PORT || 5000,()=>{
    console.log('listening to port 5000');

});
  
