const Conversation = require("../model/conversation");

const getActorId = (req) =>
  req.authType === "seller"
    ? String(req.seller._id)
    : String(req.user._id);

const createNewConversation = async (req, res) => {
  try {
    if (req.authType !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only users can start a seller conversation",
      });
    }

    const { groupTitle, sellerId } = req.body;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: "Seller ID is required",
      });
    }

    const userId = String(req.user._id);

    const existingConversation = await Conversation.findOne({
      members: { $all: [userId, String(sellerId)] },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        conversation: existingConversation,
      });
    }

    const conversation = await Conversation.create({
      members: [userId, String(sellerId)],
      groupTitle,
    });

    res.status(201).json({
      success: true,
      conversation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllConversations = async (req, res) => {
  try {
    const actorId = getActorId(req);

    const conversations = await Conversation.find({
      members: actorId,
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createNewConversation,
  getAllConversations,
};
