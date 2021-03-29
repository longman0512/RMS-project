const router = require("express").Router();
const {
  getLabDesc,
  getLabDescs,
  countLabDescs,
  insertLabDesc,
  updateLabDesc,
  deleteLabDesc,
  deleteLabDescs
} = require("./labdesc.controller");
const { verifyAccessToken } = require('../../config/jwt_helper');

router.get("/getLabDesc/:id", verifyAccessToken,getLabDesc);
router.get("/getLabDescs", verifyAccessToken,getLabDescs);
router.get("/countLabDescs", verifyAccessToken,countLabDescs);
router.post("/insertLabDesc", verifyAccessToken,insertLabDesc);
router.put("/updateLabDesc", verifyAccessToken,updateLabDesc);
router.delete("/deleteLabDesc/:id", verifyAccessToken,deleteLabDesc);
router.delete("/deleteLabDescs", verifyAccessToken,deleteLabDescs);

module.exports = router;
