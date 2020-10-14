module.exports = app=>{
    const tutorials = require('../controller/controller.js');

    var router =  require('express').Router();
    router.get('/',(req,res)=>{
        res.send('Welcome To BRYANS PROJECT');
    });
    //creates an entry
    router.post('/',tutorials.create);
    //retrieves all entries
    router.get('/all',tutorials.findAll);
    ////retrieves all entries for a particular hospital
    router.get('/all/:id',tutorials.findOneMany);
    //gets all recent attributes for every hospital 
    router.get('/recent/',tutorials.findAllRecent);
     //gets all hour specific attributes for every hospital 
    router.get('/specific/',tutorials.findAllSpecific);
    


    //gets locations for all hospitals
    router.get('/local',tutorials.getLocations);
    //gets recent attributes for every hospital with its location
    router.get('/local/recent',tutorials.getRecent);
    //gets the specific date-time attributes their locations
    router.get('/local/specific',tutorials.getSpecific);

    router.get('local/group',tutorials.getGroup);

    // router.delete('/:id',tutorials.delete);

    // router.delete('/',tutorials.deleteAll);

    app.use('/',router);

    
}
