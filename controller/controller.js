//importing modules: the database model, sequelize, moment-timezone
const db = require('../models');
const { sequelize } = require('../models');
const Hospital = db.hospitals;
const Op = db.Sequelize.Op;
const Sequelize = require('sequelize');
const moment = require('moment-timezone')

//creates the hospital record
exports.create = (req, res) => {
    console.log(req.body);
    // Validate request
   if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be an entry"
      });
      return;
    }
    // Creates a record body
    const hospital = {
        name:req.body.name,
        type:req.body.type,
        admitted:req.body.admitted,
        doctors:req.body.doctors,
        nurses:req.body.nurses,
        time:req.body.time
    };
    // Saves record in the database
    Hospital.create(hospital)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating entry."
        });
      });
  };
  //finds all existing records 
exports.findAll = (req,res)=>{
    console.log(req.query)
    Hospital.findAll({where:null}).then(data=>{
        data.forEach((hos) => {
            hos.dataValues.time = moment.tz(hos.dataValues.time, "Africa/Blantyre").toString();
            hos.dataValues.createdAt = moment.tz(hos.dataValues.createdAt, "Africa/Blantyre").toString();
            hos.dataValues.updatedAt = moment.tz(hos.dataValues.updatedAt, "Africa/Blantyre").toString();
        })
        res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:
            err.message || 'Some error occured when retrieving hospitals records'
        });
    });
};
 // finds all records for a particular name
exports.findOneMany = (req,res)=>{
    const id = req.params.id;
    Hospital.findAll({where:{name:id}}).then(data=>{
        data.forEach((hos) => {
//adjust the time to the correct timezone
            hos.dataValues.time = moment.tz(hos.dataValues.time, "Africa/Blantyre").toString();
            hos.dataValues.createdAt = moment.tz(hos.dataValues.createdAt, "Africa/Blantyre").toString();
            hos.dataValues.updatedAt = moment.tz(hos.dataValues.updatedAt, "Africa/Blantyre").toString();
        })
        res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:
            err.message || 'Some error occured when retrieving hospital'
        });
    });
};
//get specific hour attributes
exports.findAllSpecific = (req,res)=>{
// getting the parameters in the url query
    const hour = req.query.h;
    const day = req.query.d;
    const month  = req.query.m;
    const fdate = '2020-'+month+'-'+day+'T1'+hour+':00:00+02';
    const ldate = '2020-'+month+'-'+day+'T1'+hour+':59:00+02';
    sequelize.query(`select * \
                    from hospitals \
                    where time >= '${fdate}' and time <='${ldate}' `,Hospital,{raw:true}).then(function(data){
        var fts=[]
        data[0].forEach(element => {
            console.log(element)
            var ft = {"type":"Feature","properties":element};
            fts.push(ft)
        });
        fts.forEach((hos) => {
//adjust the time to the correct timezone
            hos.properties.time = moment.tz(hos.properties.time, "Africa/Blantyre").toString();
            hos.properties.createdAt = moment.tz(hos.properties.createdAt, "Africa/Blantyre").toString();
            hos.properties.updatedAt = moment.tz(hos.properties.updatedAt, "Africa/Blantyre").toString();
        })
        res.send(fts);
    });
}
//recent attributes
exports.findAllRecent = (req,res)=>{
    sequelize.query("select hospitals.* from hospitals  INNER JOIN ( select hospitals.name,max(hospitals.time) max_date from hospitals group by hospitals.name) b on hospitals.name = b.name and hospitals.time= b.max_date",Hospital,{raw:true}).then(function(data){
        var fts=[]
        data[0].forEach(element => {
            console.log(element)
            var ft = {"type":"Feature","properties":element};
            fts.push(ft)
        });
        fts.forEach((hos) => {
//adjust the time to the correct timezone
            hos.properties.time = moment.tz(hos.properties.time, "Africa/Blantyre").toString();
            hos.properties.createdAt = moment.tz(hos.properties.createdAt, "Africa/Blantyre").toString();
            hos.properties.updatedAt = moment.tz(hos.properties.updatedAt, "Africa/Blantyre").toString();
        })
        res.send(fts);
    });
}
// raw locations not much attributes
exports.getLocations=(req,res)=>{
    sequelize.query("select * from h_locations",null,{raw:true}).then(function(data){
        var fts=[]
        data[0].forEach(element => {
            var ft = {"type":"Feature","properties":element};
            fts.push(ft)
        });
        res.send(fts);
    });
}
//locations with attributes
exports.getRecent=(req,res)=>{
    sequelize.query("select recent.*, h_locations.lat,h_locations.lon from  \
	                (select hospitals.*  \
		            from hospitals  \
		            INNER JOIN  \
			        (select hospitals.name,max(hospitals.time) max_date from hospitals group by hospitals.name) \
			        b on hospitals.name = b.name and hospitals.time= b.max_date) as recent \
	                full outer join h_locations on recent.name=h_locations.name",Hospital,{raw:true}).then(function(data){      
                        var fts=[]
                        data[0].forEach(element => {
                            var ft = {"type":"Feature","properties":element,"geometry":{"type":"Point","coordinates":[parseFloat(element.lon),parseFloat(element.lat)]}};
                            fts.push(ft)
                        });
                        fts.forEach((hos) => {
//adjust the time to the correct timezone
                            hos.properties.time = moment.tz(hos.properties.time, "Africa/Blantyre").toString();
                            hos.properties.createdAt = moment.tz(hos.properties.createdAt, "Africa/Blantyre").toString();
                            hos.properties.updatedAt = moment.tz(hos.properties.updatedAt, "Africa/Blantyre").toString();
                        })
                        var coll ={
                            "type": "FeatureCollection",
                                "name": 'Latest',
                                    "crs": { "type": "name", "properties": {"name":"urn:ogc:def:crs:OGC:1.3:CRS84" } },
                                "features":fts
                            }
                
                        res.send(coll);
    });
}
//gets specific attributes plus locations
exports.getSpecific = (req,res)=>{
    var date = new Date();
// getting the parameters set in the url query
    const hour = req.query.h;
    const day = req.query.d;
    const month  = req.query.m;
    const t = req.query.t;
//defining the the date-time period
    const fdate = '2020-'+month+'-'+day+'T'+t+hour+':00:00+02';
    const ldate = '2020-'+month+'-'+day+'T'+t+hour+':59:00.+02'; 
    sequelize.query(`select hospitals.* ,h_locations.lat,h_locations.lng
                        from hospitals
                        full outer join h_locations on hospitals.name=h_locations.h_name
                    where time >= '${fdate}' and time <='${ldate}' `,Hospital,{raw:true}).then(function(data){
        var fts=[]
        data[0].forEach(element => {
            var ft = {"type":"Feature","properties":element,"geometry":{"type":"Point","coordinates":[parseFloat(element.lat),parseFloat(element.lng)]}};
            fts.push(ft)
        });
        fts.forEach((hos) => {
//adjust the time to the correct timezone
            hos.properties.time = moment.tz(hos.properties.time, "Africa/Blantyre").toString();
            hos.properties.createdAt = moment.tz(hos.properties.createdAt, "Africa/Blantyre").toString();
            hos.properties.updatedAt = moment.tz(hos.properties.updatedAt, "Africa/Blantyre").toString();
        })
//defining a GeoJSON of the features
        var coll ={
            "type": "FeatureCollection",
                "name": fdate,
                    "crs": { "type": "name", "properties": {"name":"urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features":fts
            }
        res.send(coll);
    });
}
//gets the last time a user enetered a record in the database
exports.getlatestTime=(req,res)=>{
    sequelize.query('select "time" from hospitals order by "time" desc limit 1',Hospital, { raw: true }).then(function(data){
        var t = {'Latest':data[0][0].time}
        t.Latest = moment.tz(t.Latest, "Africa/Blantyre").toString();
        res.send(t)

    })
}
//gets monthly attributes for a particular hospital
exports.getMonth= (req,res)=>{
    const hos_id = req.query.id;
    const m = req.query.m;
    const y= req.query.y
    const days = daysInAmonth(m,y)
    console.log(days)
    sequelize.query(`select * from hospitals where name='${hos_id}' and time>'${y}-${m}-01T00:00:00+02' and time<'${y}-${m}-${days}T23:59:00+02'`,Hospital, { raw: true }).then(function(data){
    data[0].forEach(hos=>{ 
        console.log(hos)
//adjust the time to the correct timezone
            hos.properties.time = moment.tz(hos.properties.time, "Africa/Blantyre").toString();
            hos.properties.createdAt = moment.tz(hos.properties.createdAt, "Africa/Blantyre").toString();
            hos.properties.updatedAt = moment.tz(hos.properties.updatedAt, "Africa/Blantyre").toString();
    
        })
    
        res.send(data[0]);
    })
}

exports.getGroup = async function (req, res) {
    //var T01hours = ['T00', 'T01', 'T02', 'T03', 'T04', 'T05', 'T06', 'T07', 'T08', 'T09', 'T10', 'T11', 'T12', 'T13', 'T14', 'T15', 'T16', 'T17', 'T18', 'T19', 'T20', 'T21','T22','T23'];
    var hrs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,22,23]
    var group = {
        "name": Date(),
        "data": []
    };
    const promises = hrs.map(async (hour) => {
        const day = req.query.d;
        const month = req.query.m;
        const hr = decideQuery(hour)
        const fdate = '2020-' + month + '-' + day + hr + ':00:00+02';
        const ldate = '2020-' + month + '-' + day + hr + ':59:00+02';
        var fts=[]
        var data = await sequelize.query(`select hospitals.* ,h_locations.lat,h_locations.lon
                        from hospitals
                        full outer join h_locations on hospitals.name=h_locations.name
                    where time >= '${fdate}' and time <='${ldate}' `, Hospital, { raw: true });
        data[0].forEach(element => {
            var ft = { "type": "Feature", "properties": element, "geometry": { "type": "Point", "coordinates": [parseFloat(element.lon), parseFloat(element.lat)] } };
            fts.push(ft)
        });
        fts.forEach((hos) => {
//adjust the time to the correct timezone
            hos.properties.time = moment.tz(hos.properties.time, "Africa/Blantyre").toString();
            hos.properties.createdAt = moment.tz(hos.properties.createdAt, "Africa/Blantyre").toString();
            hos.properties.updatedAt = moment.tz(hos.properties.updatedAt, "Africa/Blantyre").toString();
        })
        
        var coll = {
            "type": "FeatureCollection",
            "name": hour,
            "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
            "features": fts
        }
        group.data.push(coll)
    })
    await Promise.all(promises)
    console.log(group.data.length)
    group.data.sort(function(a, b) {
        return parseFloat(a.name) - parseFloat(b.name);
    });
    
    res.send(group);
}
//gets a whole days worth of attributes for a particular hospital
exports.getDayGroup = (req,res)=>{
    const id = req.query.id
    const d = req.query.d
    const m = req.query.m
    const y = req.query.y 
    const fdate = `${y}-${m}-${d}T00:00:00+02`
    const ldate = `${y}-${m}-${d}T23:59:00+02`
    sequelize.query(`select * from hospitals where "time">'${fdate}' and "time"<='${ldate}' and "name"='${id}' `, Hospital, { raw: true }).then(function(data){
        
        var coll = {
            'name':req.query.id,
            'features':[]
        }
        data[0].forEach(ele=>{
            console.log(ele.time)
            ele.time = moment.tz(ele.time, "Africa/Blantyre").toString();
            const t = String(ele.time) 
            const h = t.substring(16,18)
            var ft = {
                'hour':h,
                'admitted':ele.admitted,
                'doctors':ele.doctors,
                'nurses':ele.nurses,
            }
            coll.features.push(ft)
        })
 
        res.send(coll)
    })
}
exports.DownloadDayGroup = async (req,res)=>{
    const id = req.query.id
    const d = req.query.d
    const m = req.query.m
    const y = req.query.y 
    const fdate = `${y}-${m}-${d}T00:00:00-08`
    const ldate = `${y}-${m}-${d}T23:59:00-08`
    sequelize.query(`select * from hospitals where "time">'${fdate}' and "time"<='${ldate}' and "name"='${id}' `, Hospital, { raw: true }).then(function(data){
        
        var coll = {
            'name':req.query.id,
            'features':[]
        }
        data[0].forEach(ele=>{
            console.log(ele.time)
            const t = String(ele.time) 
            const h = t.substring(16,18)
            var ft = {
                'hour':generateHour(h),
                'admitted':ele.admitted,
                'doctors':ele.doctors,
                'nurses':ele.nurses,
            }
            coll.features.push(ft)
        })
        const csv = new ObjectsToCsv(coll.features)

        const url = './res/'+`${y}${m}${d}_`+req.query.id+'.csv'

        const fname =`${y}-${m}-${d} for `+req.query.id+'.csv';
        csv.toDisk(url).then(()=>{
            res.download(url, fname, (err) => {
                if (err) {
                  res.status(500).send({
                    message: "Could not download the file. " + err,
                  });
                }
              });
        })

    
    })
}

function decideQuery(hour){
    if(hour<10){
        return 'T0'+hour;
    }else{
        return 'T'+hour;
    }
}
function daysInAmonth(mon,year){
    return new Date(year,mon,0).getDate();
}
function generateHour(hour){
    return hour+':00';
}






