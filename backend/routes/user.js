const express = require("express");

const {
  registerUser,
  activateUser,
  loginUser,
  updateUserInfo,
} = require("../controller/user");

const { isAuthenticated } = require("../middleware/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/activation", activateUser);
router.post("/login", loginUser);

router.get("/getuser", isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

router.put("/update-user-info", isAuthenticated, updateUserInfo);

router.post("/logout", isAuthenticated, (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;