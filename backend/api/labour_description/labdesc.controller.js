const {
  getLabDesc,
  getLabDescs,
  countLabDescs,
  insertLabDesc,
  updateLabDesc,
  deleteLabDesc,
  deleteLabDescs
} = require("./labdesc.service");
const createError = require('http-errors')
const { verifyRefreshToken } = require('../../config/jwt_helper')

module.exports = {
  getLabDesc: async (req, res, next) => {
    try {    
      await verifyRefreshToken(req);
      const labDesc_id = req.params.id;
      getLabDesc(labDesc_id, async (err, results) => {
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
  getLabDescs: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      getLabDescs(manager_id, async (err, results) => {
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
  countLabDescs: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      countLabDescs(manager_id, async (err, results) => {
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
  insertLabDesc: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      const body = req.body;
      body.manager = manager_id;
      if(!body.internal_code){
        countLabDescs(body.manager, async (err, results) => {
          if (err) { 
            return next(createError.InternalServerError())
          }
          body.internal_code = results + 1;            
        });
      }
      insertLabDesc(body, async (err, results) => {
        if (err) { 
          return next(createError.InternalServerError())
        }        
        return res.json({
          message: (results || 0) + " LabDesc inserted successfully"
        });          
      });
    } catch (error) {
      next(error)
    } 
  },
  updateLabDesc: async (req, res, next) => {
    try {    
      const resRef = await verifyRefreshToken(req);
      const manager_id = resRef[2];
      const body = req.body;
      body.manager = manager_id;
      updateLabDesc(body, (err, results) => {
        if (err) { 
          return next(createError.InternalServerError())
        }
        return res.json({
          id: results,
          message: ((results) ? 1 : 0) + " LabDesc updated successfully"
        });
      });
    } catch (error) {
      next(error)
    } 
  },
  deleteLabDesc: async (req, res, next) => {
    try {
      await verifyRefreshToken(req);
      const labDesc_id = req.params.id;
      deleteLabDesc(labDesc_id, (err, results) => {
        if (err) {
          return next(createError.InternalServerError())
        }
        //console.log(results);
        return res.json({
          id: results,
          message: ((results) ? 1 : 0) + " LabDesc deleted successfully"
        });
      });
    } catch (error) {
      next(error)
    } 
  },
  deleteLabDescs: async (req, res, next) => {
    try {     
      await verifyRefreshToken(req);
      const labDesc_id = req.query.id;
      deleteLabDescs(labDesc_id, (err, results) => {
        if (err) {
          return next(createError.InternalServerError())
        }
        return res.json({
          id: results,
          message: (results.length || '0') + " LabDesc" + ( results.length == 1 ? "" : "s") +" deleted successfully"
        });
      });
    } catch (error) {
      next(error)
    } 
  },
};
