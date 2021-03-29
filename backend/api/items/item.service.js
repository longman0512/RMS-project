const mysql = require("../../config/database");

module.exports = {
  getItem: async (item_id, callBack) => {
    //console.log(item_id);
    const connection = await mysql.connection();
    let results = supplier = '';
    try {     
      //console.log("at getItem...");
      results = await connection.query(
        `SELECT item_id,internal_code,supplier_code,supplier_id,supplier_desc,significant_asset,description,
        um,qty,cost,price,discount_id,discount,tag
        FROM item AS i 
        LEFT JOIN s_elem_row AS s ON i.elemrow_id = s.elemrow_id 
        LEFT JOIN s_com_columns AS s2 ON i.comcol_id = s2.comcol_id 
        WHERE i.item_id = ?`,
        [item_id]
      );
      //console.log(results);
      if (results) {
        if(results[0].supplier_id){
          supplier = await connection.query(
            `SELECT supplier_id,supplier_code,type,business_name,name,surname,vat,code,address,city,zip_postcode,
            state_province,country,rec_code,tel_number1,tel_number2,email,certified_email,logo,tag
            FROM supplier AS m 
            LEFT JOIN s_registry_company AS a ON m.registry_co_id = a.registry_co_id 
            LEFT JOIN s_registry AS s ON s.registry_id = a.registry_id 
            LEFT JOIN s_address AS s1 ON s1.address_id = s.address_id
            LEFT JOIN s_com_columns AS s2 ON s2.comcol_id = m.comcol_id 
            WHERE m.supplier_id = ?`,
            [results[0].supplier_id]);
          //console.log(supplier);       
          if(supplier){
            results[0].supplier_id = supplier; 
          } 
        }        
      }     
    } catch (err) {
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results[0]);
    }
  },
  getItems: async (manager_id, callBack) => {
    //console.log(data);
    const connection = await mysql.connection();
    let results = supp = '';
    let suppliers = [];
    let foundit = false;
    try {     
      //console.log("at getItems...");
      results = await connection.query(
        `SELECT item_id,internal_code,supplier_code,supplier_id,supplier_desc,significant_asset,description,
        um,qty,cost,price,discount_id,discount,tag
        FROM item AS i 
        LEFT JOIN s_elem_row AS s ON i.elemrow_id = s.elemrow_id 
        LEFT JOIN s_com_columns AS s2 ON i.comcol_id = s2.comcol_id 
        WHERE s2.manager_id = ?`,
        [manager_id]
      );
      //console.log(results);
      if (results) {
        for(let i=0;i<results.length;i++){
          if(results[i].supplier_id != null){        
            suppliers[i] = results[i].supplier_id;
          } 
        }
        //console.log(suppliers);
        if(suppliers){
          supp = await connection.query(
            `SELECT supplier_id,supplier_code,type,business_name,name,surname,vat,code,address,city,zip_postcode,
            state_province,country,rec_code,tel_number1,tel_number2,email,certified_email,logo,tag
            FROM supplier AS m 
            LEFT JOIN s_registry_company AS a ON m.registry_co_id = a.registry_co_id 
            LEFT JOIN s_registry AS s ON s.registry_id = a.registry_id 
            LEFT JOIN s_address AS s1 ON s1.address_id = s.address_id
            LEFT JOIN s_com_columns AS s2 ON s2.comcol_id = m.comcol_id
            WHERE m.supplier_id IN (?)`,
            [suppliers]);
          //console.log(supp);
          if(supp.length != 0){
            for(let i=0;i<suppliers.length;i++){
              for(let j=0;j<supp.length && !foundit;j++){
                if(suppliers[i] == supp[j].supplier_id){
                  results[i].supplier_id = supp[j];            
                  supp.slice(j,1);
                  foundit = true;
                }
              }
            /*if(!foundit){
              results[results.length] += results[i].id_fornitore +' Row Supplier,';
            }*/
            foundit = false;         
            }   
          }  
        }
      }     
    } catch (err) {
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results);
    }     
  },
  countItems: async (manager_id, callBack) => {
    const connection = await mysql.connection();
    let results = '';
    //console.log(manager_id);
    try {
      //console.log("at countItems...");
      results = await connection.query(
        `SELECT COUNT(*) AS count
        FROM item AS i
        LEFT JOIN s_com_columns AS s2 ON i.comcol_id = s2.comcol_id 
        WHERE s2.manager_id = ?`,
        [manager_id]
      );
      //console.log(results);
    } catch (err) {
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results[0].count);
    }
  },
  insertItem: async (data, callBack) => {
    const connection = await mysql.connection();
    let results = elemrow = comcol = '';
    try {
      //console.log("at insertItem...");
      await connection.query("START TRANSACTION");    
      elemrow = await connection.query(
        `INSERT INTO s_elem_row (internal_code,supplier_code,
          supplier_id,supplier_desc,description,um,qty,cost,price,discount_id,discount) 
          VALUES(?,?,?,?,?,?,?,?,?,?,?)`,
         [
           data.internal_code,
           data.supplier_code,
           data.supplier_id,
           data.supplier_desc,
           data.description,
           data.um,
           data.qty,
           data.cost,
           data.price,
           data.discount_id,
           data.discount,
         ]
      );
      comcol = await connection.query(
        `INSERT INTO s_com_columns (manager_id,tag) 
        VALUES (?,?)`, 
        [
          data.manager,
          data.tag,           
          ]
        );
      results = await connection.query(
        `INSERT INTO item (comcol_id,elemrow_id,significant_asset) 
        VALUES (?,?,?)`, 
        [
          comcol.insertId,
          elemrow.insertId,
          data.sign_asset,           
        ]
      );      
      results = 'id:' + results.insertId;  
      await connection.query("COMMIT");   
    } catch (err) {
      await connection.query("ROLLBACK");
      //console.log('ROLLBACK at insertItem', err);
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results);
    }
  },
  updateItem: async (data, callBack) => {
    //console.log(data);
    const connection = await mysql.connection();
    let results = '';
    try {
      //console.log("at updateItem...");
      await connection.query("START TRANSACTION");
      results = await connection.query(
        `UPDATE item SET significant_asset = ? WHERE item_id = ?`,
        [              
          data.sign_asset,           
          data.item_id
        ]
      );
      if(results.affectedRows > 0){
        await connection.query(
          `UPDATE s_elem_row SET internal_code = ?,supplier_code = ?,
          supplier_id = ?,supplier_desc = ?,description = ?,um = ?,qty = ?,cost = ?,price = ?,discount_id = ?,discount = ? 
          WHERE elemrow_id IN (SELECT elemrow_id FROM item WHERE item_id = ?)`,
          [
            data.internal_code,
            data.supplier_code,
            data.supplier_id,
            data.supplier_desc,
            data.description,
            data.um,
            data.qty,
            data.cost,
            data.price,
            data.discount_id,
            data.discount,
            data.item_id
          ]
        );
        await connection.query(
          `UPDATE s_com_columns SET tag = ? 
          WHERE comcol_id IN (SELECT comcol_id FROM item WHERE item_id = ?)`,
          [
            data.tag,
            data.item_id,
          ]
        );
        results = data.item_id;
      }else{
        results = '';
      }   
      await connection.query("COMMIT");   
    } catch (err) {
      await connection.query("ROLLBACK");
      //console.log('ROLLBACK at updateItem', err);
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results);
    }
  },
  deleteItem: async (item_id, callBack) => {
    //console.log(item_id);
    const connection = await mysql.connection();
    let results = item = '';
    try {
      //console.log("at deleteItem...");
      await connection.query("START TRANSACTION");
      results = await connection.query(
        `SELECT elemrow_id,comcol_id FROM item WHERE item_id = ?`,
        [item_id]
      );
      if(results){
        item = await connection.query(
          `DELETE FROM item WHERE item_id = ?`,
          [item_id]
        );
        await connection.query(
          `DELETE FROM s_elem_row WHERE elemrow_id = ?`,
          [results[0].elemrow_id]
        );
        await connection.query(
          `DELETE FROM s_com_columns WHERE comcol_id = ?`,
          [results[0].comcol_id]
        );  
      }        
      //console.log(results);
      if(item.affectedRows > 0){
        results = item_id;
      }else{
        results = '';
      }    
      await connection.query("COMMIT");   
    } catch (err) {
      await connection.query("ROLLBACK");
      //console.log('ROLLBACK at deleteItem', err);
      throw err;
    } finally {
      await connection.release();
      return callBack(null, results);
    }
  },
  deleteItems: async (item_id, callBack) => {
    //console.log(data);
    let results = elemrow = comcol = '';
    let items = [];
    let elemrow_id = [];
    let comcol_id = [];
    const connection = await mysql.connection();
    try {
      //console.log("at deleteItems...");
      await connection.query("START TRANSACTION");
      elemrow = await connection.query(
        `SELECT elemrow_id FROM item WHERE item_id IN (?)`,
        [item_id]
      );
      comcol = await connection.query(
        `SELECT comcol_id FROM item WHERE item_id IN (?)`,
        [item_id]
      );
      for(let i=0;i<elemrow.length;i++){
        elemrow_id[i] = elemrow[i].elemrow_id;
      }
      for(let i=0;i<comcol.length;i++){
        comcol_id[i] = comcol[i].comcol_id;
      }
      for (const item of item_id) {
        results = await connection.query(
          `DELETE FROM item WHERE item_id = ?`,
          [item]
        );
        if(results.affectedRows > 0){
          items.push(item);
        }
      }
      //console.log(res);
      await connection.query(
        `DELETE FROM s_elem_row WHERE elemrow_id IN (?)`,
        [elemrow_id]
      );
      await connection.query(
        `DELETE FROM s_com_columns WHERE comcol_id IN (?)`,
        [comcol_id]
      );      
      await connection.query("COMMIT");   
    } catch (err) {
      await connection.query("ROLLBACK");
      //console.log('ROLLBACK at deleteItems', err);
      throw err;
    } finally {
      await connection.release();
      return callBack(null, items);
    }
  }
};
