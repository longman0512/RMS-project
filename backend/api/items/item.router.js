const router = require("express").Router();
const {
  getItem,
  getItems,
  countItems,
  insertItem,
  updateItem,
  deleteItem,
  deleteItems
} = require("./item.controller");
const { verifyAccessToken } = require('../../config/jwt_helper');

router.get("/getItem/:id", verifyAccessToken,getItem);
router.get("/getItems", verifyAccessToken,getItems);
router.get("/countItems", verifyAccessToken,countItems);
router.post("/insertItem", verifyAccessToken,insertItem);
router.put("/updateItem", verifyAccessToken,updateItem);
router.delete("/deleteItem/:id", verifyAccessToken,deleteItem);
router.delete("/deleteItems", verifyAccessToken,deleteItems);

module.exports = router;
