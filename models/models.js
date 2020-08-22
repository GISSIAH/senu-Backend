module.exports = (sequelize,Sequelize)=>{
    const Hospital = sequelize.define('hospitals',{
        name:{
            type:Sequelize.STRING
        },
        type:{
            type:Sequelize.STRING
        },
        admitted: {
            type: Sequelize.INTEGER
        },
        doctors: {
            type: Sequelize.INTEGER
        },
        nurses: {
            type: Sequelize.INTEGER
        },
        time: {
            type: Sequelize.DATE
        }

    });
    return Hospital;
}