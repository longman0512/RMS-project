const {
  getItem,
  getItems,
  countItems,
  insertItem,
  updateItem,
  deleteItem,
  deleteItems
} = require("./item.service");
const createError = require('http-errors')
const { verifyRefreshToken } = require('../../config/jwt_helper')

module.exports = {
  getItem: async (req, res, next) => {
    try {    
      await verifyRefreshToken(req);
      const item_id = req.params.id;
      getItem(item_id, async (err, results) => {
        if (err) { 
          return next(createError.InternalServerError())
        }
        return res.json({
          message: results || '[]'
        });             
      });
    } catch (error) {
      next(error)
    } 
  },
  getItems: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      getItems(manager_id, async (err, results) => {
        if (err) { 
          return next(createError.InternalServerError())
        }       
        return res.json({
          message: results
        });     
      });
    } catch (error) {
      next(error)
    } 
  },
  countItems: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      countItems(manager_id, async (err, results) => {
        if (err) { 
          return next(createError.InternalServerError())
        }
        return res.json({
          message: results || '[]'
        });             
      });
    } catch (error) {
      next(error)
    } 
  },
  insertItem: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      const body = req.body;
      body.manager = manager_id;
      if(!body.internal_code){
        countItems(body.manager, async (err, results) => {
          if (err) { 
            return next(createError.InternalServerError())
          }
          body.internal_code = results + 1;            
        });
      }
      insertItem(body, async (err, results) => {
        if (err) { 
          return next(createError.InternalServerError())
        }        
        return res.json({
          message: (results || 0) + " Item inserted successfully"
        });          
      });
    } catch (error) {
      next(error)
    } 
  },
  updateItem: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      const body = req.body;
      body.manager = manager_id;
      updateItem(body, (err, results) => {
        if (err) { 
          return next(createError.InternalServerError())
        }
        return res.json({
          id: results,
          message: ((results) ? 1 : 0) + " Item updated successfully"
        });
      });
    } catch (error) {
      next(error)
    } 
  },
  deleteItem: async (req, res, next) => {
    try {
      await verifyRefreshToken(req);
      const item_id = req.params.id;
      deleteItem(item_id, (err, results) => {
        if (err) {
          return next(createError.InternalServerError())
        }
        //console.log(results);
        return res.json({
          id: results,
          message: ((results) ? 1 : 0) + " Item deleted successfully"
        });
      });
    } catch (error) {
      next(error)
    } 
  },
  deleteItems: async (req, res, next) => {
    try {
      await verifyRefreshToken(req);
      const item_id = req.query.id;
      deleteItems(item_id, (err, results) => {
        if (err) {
          return next(createError.InternalServerError())
        }
        return res.json({
          id: results,
          message: (results.length || '0') + " Item" + ( results.length == 1 ? "" : "s") +" deleted successfully"
        });
      });
    } catch (error) {
      next(error)
    } 
  },
};
