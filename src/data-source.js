var typeorm = require("typeorm")

var dataSource = new typeorm.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres", 
    password: "", // put your password here if none leave it empty
    database: "grading_system", // name of your database
    synchronize: true, // if true, then database will be created if it doesn't exist
    entities: [__dirname + '/entity/*.js'], // path to your entities
})

module.exports = {dataSource}