const mysql = require("../../config/database");

module.exports = {
  login: async (email, callBack) => {
    //console.log(email);
    const connection = await mysql.connection();
    let results = registry = manager = dt = missing = '';
    try {     
      //console.log("at queryLogin...");
      await connection.query("START TRANSACTION");
      results = await connection.query(
        `SELECT user_id,manager_id,registry_id,password,email,roles,status,tag
          FROM user AS u 
          LEFT JOIN s_com_columns AS s ON u.comcol_id = s.comcol_id 
          WHERE email = ?`,
        [email]);
      //console.log(results);
      if (results) {
        registry = await connection.query(
          `SELECT * FROM s_registry AS s
          LEFT JOIN s_address AS s1 ON s1.address_id = s.address_id
          WHERE registry_id = ?`,
          [results[0].registry_id]);
        //console.log(registry);       
        if (registry) {
          results[0].registry_id = registry; 
          manager = await connection.query(
            `SELECT manager_id,business_name,logo,name,surname,vat,code,address,zip_postcode,city,state_province,country,
            tel_number1,tel_number2,email,certified_email,
             rec_code FROM s_manager AS m 
             LEFT JOIN s_registry_company AS a ON m.registry_co_id=a.registry_co_id
             LEFT JOIN s_registry AS s ON a.registry_id = s.registry_id
             LEFT JOIN s_address AS s1 ON s1.address_id = s.address_id
             WHERE m.manager_id = ?`,
            [results[0].manager_id]);
          if (manager) {
            results[0].manager_id = manager;
            //console.log(user);
            dt = require('moment')().format('YYYY-MM-DD HH:mm:ss');
            await connection.query(
              `INSERT INTO s_login(login_id, user_id, datetime) VALUES(NULL,?,?)`,
              [results[0].user_id, dt]);
          } else {         
            /*missing += 'Manager:' + results[0].manager_id + ',';
            //console.log(missing);
            results.splice(results.length, 0, missing);*/
            results = '';
          }         
        }           
      } else {
          /*missing += 'Registry:' + results[0].registry_id + ',';
          //console.log(missing);
          results.splice(results.length, 0, missing); */ 
          results = '';       
        }       
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      //console.log('ROLLBACK at login', err);
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results[0]);
    }
  },
  updatePassword: async (data, callBack) => {
    //console.log(data.userId);
    //console.log(data.password);
    const connection = await mysql.connection();
    let results = '';  
    try {
      results = await connection.query(
        `UPDATE user SET password = ? WHERE user_id = ?`,
        [
          data.password,
          data.userId
        ]);
    } catch (err) {
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results.affectedRows);
    }
  },
  deleteUser: async (userId, callBack) => {
    //console.log(data.userId);
    const connection = await mysql.connection();
    let results = user = '';  
    try {
      //console.log("at deleteUser...");
      await connection.query("START TRANSACTION"); 
      results = await connection.query(
        `SELECT registry_id,comcol_id FROM user WHERE user_id = ?`,
        [userId]);
      if(results){
        user = await connection.query(
          `DELETE FROM user WHERE user_id = ?`,
          [userId]);    
        await connection.query(
          `DELETE FROM s_registry WHERE registry_id = ?`,
          [results.registry_id]);
        await connection.query(
          `DELETE FROM s_com_columns WHERE comcol_id  = ?`,
          [results.comcol_id]);   
      }     
      await connection.query("COMMIT");
    } catch (err) {
      await connection.query("ROLLBACK");
      //console.log('ROLLBACK at deleteUser', err);
      throw err;
    } finally {
      await connection.release();
      return callBack(null, user.affectedRows);
    }
  }
};



