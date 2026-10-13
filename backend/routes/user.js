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
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
