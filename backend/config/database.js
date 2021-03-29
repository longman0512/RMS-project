const { createPool } = require("mysql");

const pool = createPool({
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
  connectionLimit: 10
});

const connection = () => {
  return new Promise((resolve, reject) => {
  pool.getConnection((err, connection) => {
    if (err){
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.error('Database connection was closed.')
      }
      if (err.code === 'ER_CON_COUNT_ERROR') {
        console.error('Database has too many connections.')
      }
      if (err.code === 'ECONNREFUSED') {
        console.error('Database connection was refused.')
      }
      reject(err);
    } 
    //console.log("MySQL pool connected: threadId " + connection.threadId);
    const query = (sql, binding) => {
      return new Promise((resolve, reject) => {
         connection.query(sql, binding, (err, result) => {
           if (err){
            reject(err);
           } 
           resolve(result);
           });
         });
       };
       const release = () => {
         return new Promise((resolve, reject) => {
           if (err){
            reject(err);
           } 
           //console.log("MySQL pool released: threadId " + connection.threadId);
           resolve(connection.release());
         });
       };
       resolve({ query, release });
     });
   });
 };
const query = (sql, binding) => {
  return new Promise((resolve, reject) => {
    pool.query(sql, binding, (err, result, fields) => {
      if (err){
        reject(err);
      } 
      resolve(result);
    });
  });
};

module.exports = { pool, connection, query };
