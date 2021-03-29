const {
  login,
  updatePassword,
  deleteUser
} = require("./user.service");
const createError = require('http-errors')
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../../config/jwt_helper')
var redis = require('redis');
const client = require('../../config/init_redis')
var redisDeletePattern = require('redis-delete-pattern');
const publicIp = require('public-ip');
let geoip = require('geoip-lite');

module.exports = {
  login: async (req, res, next) => {
    try {
      const body = req.body
      login (body.email, async (err, results) => {    
        if (err) {
          return next(createError.InternalServerError())
        }
        // console.log(results);
        if (!results) {
          return next(createError.BadRequest('Invalid email or password'))               
        }       
        /*if(results.length > 1){ 
          //console.log(results[results.length-1]+' missing!');    
          return next(createError.BadRequest('Record not found'))   
        }*/
        const result = compareSync(body.password, results.password);
        if (result) {
        // if (true) {
          results.password = undefined;
          const accessToken = await signAccessToken(results.user_id); 
          //console.log(results);
          const deviceId = require("crypto").randomBytes(64).toString('hex');
          const refreshToken = await signRefreshToken(results.user_id,deviceId,results.manager_id[0].manager_id);
          const exp = new Date(Date.now() + 604800000);
          // let ip = await publicIp.v6() || await publicIp.v4() || '';
          // var geo = geoip.lookup(ip);
          results.accessToken = accessToken;
          results.expires = exp;
          // results.language = geo.country
          return res
          .cookie('refreshToken', refreshToken, {
            expires: exp,
            secure: false, // set to true if your using https
            httpOnly: true,
          })
          .json({
            message: results
          });                    
        } else {
          return next(createError.BadRequest('Invalid email or password'))
        }
      });      
    } catch (error) {    
      next(error);
    }    
  },
  updatePassword: async (req, res, next) => {   
    try {
      const resRef = await verifyRefreshToken(req);
      const body = req.body;
      body.userId = resRef[0];   
      const salt = genSaltSync(10);
      body.password = hashSync(body.password, salt);
      updatePassword(body, (err, results) => {
        if (err) {
          return next(createError.InternalServerError())
        }
        if (!results) {
          return next(createError.BadRequest('Record Not Found'))
        }
        redisDeletePattern({
          redis: redis,
          pattern: userId+':*'
        }, function handleError (err) {
          // Fetch our keys but find nothing
        });
        return res.json({
        message: "Updated successfully"
        });
      });
    } catch (error) {
      next(error)
    } 
  },
  deleteUser: async (req, res, next) => {   
    try {
      const resRef = await verifyRefreshToken(req);
      const userId = resRef[0];
      const deviceId = resRef[1];
      deleteUser(userId+":"+deviceId, (err, results) => {
        if (err) {
          return next(createError.InternalServerError())
        }
        if (!results) {
          return next(createError.BadRequest('Record Not Found'))
        }
        client.DEL(userId, (err) => {
          if (err) {
            return next(createError.InternalServerError())
          }
          return res
          .clearCookie('refreshToken')
          .json({
            message: "User deleted successfully"
          });
        })     
      });
    } catch (error) {
      next(error)
    } 
  },
  refreshToken: async (req, res, next) => {   
    try {
      const resRef = await verifyRefreshToken(req);
      const userId = resRef[0];
      const deviceId = resRef[1];
      const managerId = resRef[2];
      //console.log(managerId);
      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId,deviceId,managerId)
      const exp = new Date(Date.now() + 604800000);
      return res
      .cookie('refreshToken', refToken, {
        expires: exp,
        secure: false, // set to true if your using https
        httpOnly: true,
      })
      .json({
        message: "Token refreshed successfully",
        accessToken: accessToken,
        expires: exp,
      });
    } catch (error) {
      next(error)
    }
  },
  logout: async (req, res, next) => {   
    try {
      const resRef = await verifyRefreshToken(req);
      const userId = resRef[0];
      const deviceId = resRef[1];
      client.DEL(userId+":"+deviceId, (err,val) => {
        if (err) {
          return next(createError.InternalServerError())
        }
        return res
        .clearCookie('refreshToken')  
        .json({
          message: "204 OK"
        });
      })
    } catch (error) {
      next(error)
    }
  }
};
