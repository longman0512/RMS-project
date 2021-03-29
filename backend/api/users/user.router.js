const router = require("express").Router();
const {
  login,
  updatePassword,
  deleteUser,
  refreshToken,
  logout
} = require("./user.controller");
const { verifyAccessToken } = require('../../config/jwt_helper');

router.post("/login", login);
router.put("/refreshToken", refreshToken);
router.patch("/updatePassword", verifyAccessToken,updatePassword);
router.delete("/deleteUser", verifyAccessToken,deleteUser);
router.delete("/logout", verifyAccessToken,logout);

module.exports = router;
