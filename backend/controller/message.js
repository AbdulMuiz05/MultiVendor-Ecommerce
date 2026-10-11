const express = require("express");
const router = express.Router();

const Messages = require("../model/messages");
const Conversation = require("../model/conversation");
const { isAuthenticatedOrSeller } = require("../middleware/auth");

const getActorId = (req) =>
  req.authType === "seller"
    ? String(req.seller._id)
    : String(req.user._id);

router.post(
  "/create-new-message",
  isAuthenticatedOrSeller,
  async (req, res) => {
    try {
      const { conversationId, text, images } = req.body;

      if (!conversationId || (!String(text || "").trim() && !images)) {
        return res.status(400).json({
          success: false,
          message: "Conversation and message content are required",
        });
      }

      const conversation = await Conversation.findOne({
        _id: conversationId,
        members: getActorId(req),
      });

      if (!conversation) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this conversation",
        });
      }

      const message = await Messages.create({
        conversationId,
        sender: getActorId(req),
        text: String(text || "").trim(),
        images,
      });

      conversation.lastMessage = message.text || "Image";
      conversation.lastMessageId = String(message._id);
      await conversation.save();

      if (process.env.SOCKET_SERVER_URL && process.env.INTERNAL_SOCKET_SECRET) {
        try {
          await fetch(`${process.env.SOCKET_SERVER_URL}/internal/publish-message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-socket-secret": process.env.INTERNAL_SOCKET_SECRET,
            },
            body: JSON.stringify({
              conversationId: String(conversation._id),
              message,
            }),
          });
        } catch (socketError) {
          console.error(`Socket publish failed: ${socketError.message}`);
        }
      }

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

router.get(
  "/get-all-messages/:id",
  isAuthenticatedOrSeller,
  async (req, res) => {
    try {
      const conversation = await Conversation.findOne({
        _id: req.params.id,
        members: getActorId(req),
      });

      if (!conversation) {
        return res.status(403).json({
          success: false,
          message: "You are not a member of this conversation",
        });
      }

      const messages = await Messages.find({
        conversationId: conversation._id,
      }).sort({ createdAt: 1 });

      res.status(200).json({
        success: true,
        messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

module.exports = router;
