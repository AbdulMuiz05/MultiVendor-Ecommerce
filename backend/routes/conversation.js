const express = require("express");

const {
  createNewConversation,
  getAllConversations,
} = require("../controller/conversation");

const { isAuthenticated, isAuthenticatedOrSeller } = require("../middleware/auth");

const router = express.Router();

router.post(
  "/create-new-conversation",
  isAuthenticated,
  createNewConversation
);

router.get(
  "/get-all-conversations",
  isAuthenticatedOrSeller,
  getAllConversations
);

module.exports = router;