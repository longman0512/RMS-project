const createError = require('http-errors')
require('dotenv').config()
require('./config/init_redis')
const express = require("express")
/* Tables' routes */
const itemRouter = require("./api/items/item.router")
const labdescRouter = require("./api/labour_description/labdesc.router")
const userRouter = require("./api/users/user.router")

const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')
app.use(express.json())
app.use(cookieParser())
app.use(cors({ credentials: true, origin: "http://localhost:8081" }));
app.use(express.urlencoded({ extended: true }))

app.use("/api/items", itemRouter)
app.use("/api/labour_desc", labdescRouter)
app.use("/api/users", userRouter)

app.use(async (req, res, next) => {
  next(createError.NotFound())
})

app.use((err, req, res, next) => { 
  res.status(err.status || 500)
  res.send({
      status: err.status || 500,
      message: err.message,
  })
})

const port = process.env.APP_PORT || 4000;
app.listen(port, () => {
  console.log("Server up and running on PORT :", port);
});
