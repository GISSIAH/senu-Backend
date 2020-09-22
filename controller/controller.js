const db = require('../models');
const { sequelize } = require('../models');
const Hospital = db.hospitals;
const Op = db.Sequelize.Op;
const Sequelize = require('sequelize');

exports.create = (req, res) => {
    console.log(req.body);
    // Validate request
   if (!req.body.name) {
      res.status(400).send({
        message: "Content can not be nuttt"
      });
      return;
    }

    // Create a Tutorial
    const hospital = {
        name:req.body.name,
        type:req.body.type,
        admitted:req.body.admitted,
        doctors:req.body.doctors,
        nurses:req.body.nurses,
        time:Date()
    };
  
    // Save Tutorial in the database
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
    //var condition = name ? {title:{[Op.iLike]: `%${name}%`}}: null;
    Hospital.findAll({where:null}).then(data=>{
        res.send(data);
    }).catch(err=>{
        res.status(500).send({
            message:
            err.message || 'Some error occured when retrieving hospitals'
        });
    });

};
 // finds all records for a particular name
exports.findOneMany = (req,res)=>{
    const id = req.params.id;
    Hospital.findAll({where:{name:id}}).then(data=>{
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
    var date = new Date();
    const hour = req.query.h;
    const day = req.query.d;
    const month  = req.query.m;
    const fdate = '2020-'+month+'-'+day+'T1'+hour+':00:00.000Z';
    const ldate = '2020-'+month+'-'+day+'T1'+hour+':59:00.000Z';
    sequelize.query(`select * \
                    from hospitals \
                    where time >= '${fdate}' and time <='${ldate}' `,Hospital,{raw:true}).then(function(data){
        var fts=[]
        data[0].forEach(element => {
            console.log(element)
            var ft = {"type":"Feature","properties":element};
            fts.push(ft)
        });
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
    sequelize.query("select recent.*, h_locations.lat,h_locations.lng from  \
	                (select hospitals.*  \
		            from hospitals  \
		            INNER JOIN  \
			        (select hospitals.name,max(hospitals.time) max_date from hospitals group by hospitals.name) \
			        b on hospitals.name = b.name and hospitals.time= b.max_date) as recent \
	                full outer join h_locations on recent.name=h_locations.h_name",Hospital,{raw:true}).then(function(data){
                        
                        var fts=[]
                        data[0].forEach(element => {
                            var ft = {"type":"Feature","properties":element,"geometry":{"type":"Point","coordinates":[parseFloat(element.lat),parseFloat(element.lng)]}};
                            fts.push(ft)
                        });
                
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
    const hour = req.query.h;
    const day = req.query.d;
    const month  = req.query.m;
    const t = req.query.t;
    const fdate = '2020-'+month+'-'+day+'T'+t+hour+':00:00.000Z';
    const ldate = '2020-'+month+'-'+day+'T'+t+hour+':59:00.000Z'; 
    sequelize.query(`select hospitals.* ,h_locations.lat,h_locations.lng
                        from hospitals
                        full outer join h_locations on hospitals.name=h_locations.h_name
                    where time >= '${fdate}' and time <='${ldate}' `,Hospital,{raw:true}).then(function(data){

        var fts=[]
        data[0].forEach(element => {
            var ft = {"type":"Feature","properties":element,"geometry":{"type":"Point","coordinates":[parseFloat(element.lat),parseFloat(element.lng)]}};
            fts.push(ft)
        });

        var coll ={
            "type": "FeatureCollection",
                "name": fdate,
                    "crs": { "type": "name", "properties": {"name":"urn:ogc:def:crs:OGC:1.3:CRS84" } },
                "features":fts
            }

        res.send(coll);
    });


}

exports.delete = (req,res)=>{

};

exports.deleteAll = (req,res)=>{

};





