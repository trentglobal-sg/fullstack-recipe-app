const mysql2 = require('mysql2/promise');

// a connection pool manages connection to the MySQL database
// a 'pool' here means it can manage 1 or many connection to the database
const pool = mysql2.createPool({
    host: "localhost",
    user: "root",
    database: "recipes",
    password: "mariadb",
    connectionLimit: 10,
    queueLimit: 0

})

// module.exports store variables and functions that are to be shared with JS files
module.exports = pool;