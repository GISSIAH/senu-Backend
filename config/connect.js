module.exports = {
    HOST:'ec2-54-246-87-132.eu-west-1.compute.amazonaws.com',
    USER:'vovrfxshwowfys',
    PASSWORD:'601bf84f965a3edb497720ca8ce8c06fbf76d132b9d8b8f3aab42143ac6179e1',
    DB:'df9o1pmlki4b90',
    PORT:5432,
    dialect:'postgres',
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
}
