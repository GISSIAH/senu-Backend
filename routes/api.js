module.exports = app=>{
    const ho = require('../controller/controller.js');
    var router =  require('express').Router();
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
    //gets daily localation with attributes in groups
    router.get('/local/group',ho.getGroup);
    router.get('/uptime',ho.getlatestTime);

    router.get('/month/',ho.getMonth);
    // router.delete('/:id',ho.delete);
    // router.delete('/',ho.deleteAll);
    app.use('/',router);
}
