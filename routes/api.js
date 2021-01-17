module.exports = app=>{
    //importing the functions from the controller file
    const ho = require('../controller/controller.js');
    //importing router object from module express.js
    var router =  require('express').Router();

    //default route on the server
    router.get('/',(req,res)=>{
        res.send('Welcome To BRYANS PROJECT');
    });
    //creates an entry
    router.post('/',ho.create);
    //retrieves all entries
    router.get('/all',ho.findAll);
    ////retrieves all entries for a particular hospital
    router.get('/all/:id',ho.findOneMany);
    //gets all recent attributes for every hospital 
    router.get('/recent/',ho.findAllRecent);
     //gets all hour specific attributes for every hospital 
    router.get('/specific/',ho.findAllSpecific);
    //gets locations for all hospitals
    router.get('/local',ho.getLocations);
    //gets recent attributes for every hospital with its location
    router.get('/local/recent',ho.getRecent);
    //gets the specific date-time attributes their locations
    router.get('/local/specific',ho.getSpecific);
    //gets daily location with attributes in groups
    router.get('/local/group',ho.getGroup);
     //gets daily data for a specific hos
     router.get('/daily/',ho.getDayGroup)
    router.get('/uptime',ho.getlatestTime);
    //gets the monthly attributes for a particular hospital
    router.get('/month/',ho.getMonth);
    router.get('/files/daily/',ho.DownloadDayGroup)
    //uses the routes defined above ontop of the default route "/"
    app.use('/',router);
}
