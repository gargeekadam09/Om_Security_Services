const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',  // Default XAMPP password is empty
  database: 'om_sercurity_services',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export promise-based version for async/await usage
module.exports = pool.promise();