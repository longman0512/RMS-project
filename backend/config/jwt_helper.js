const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./init_redis')

module.exports = {
  signAccessToken: async (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
        expiresIn: '1h',
        issuer: 'welcome',
        audience: ''+userId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          //console.log(err.message)
          reject(createError.InternalServerError())
          return
        }
        resolve(token)
      })
    })
  },
  verifyAccessToken: async (req, res, next) => {   
    if (!req.headers['authorization']){
    //console.log('access token');
      return next(createError.Unauthorized())
    } 
    if (!req.cookies.refreshToken) return next(createError.BadRequest('Need to login'))
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message
        return next(createError.Unauthorized(message))
      }
      req.payload = payload
      next()
    })
  },
  signRefreshToken: async (userId, deviceId,managerId) => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: '7d',
        issuer: 'welcome',
        audience: ''+userId+':'+managerId,
        subject: ''+deviceId,
      }
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          //console.log(err.message)
          // reject(err)
          reject(createError.InternalServerError())
        }
        client.SET(userId+':'+deviceId, token/*, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
          if (err) {
            console.log(err.message)
            console.log("errore");
            reject(createError.InternalServerError())
            return
          }
          resolve(token)
        }*/); 
        resolve(token);
      })
    })
  },
  verifyRefreshToken: async (req) => {
    return new Promise((resolve, reject) => {
      const refreshToken = req.cookies.refreshToken || '';   
      if (!refreshToken) throw createError.BadRequest()
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized())
          const aud = payload.aud.split(':')
          const userId = aud[0]
          const managerId = aud[1]
          const deviceId = payload.sub
          //console.log(userId)
          //console.log(deviceId)
          client.GET(userId+':'+deviceId, (err, result) => {
            if (err) {
              //console.log('err');
              reject(createError.InternalServerError())
              return
            }
            if (refreshToken === result){
              return resolve([userId,deviceId,managerId])
            } 
            reject(createError.Unauthorized())
          })
        }
      )
    })
  },
}
