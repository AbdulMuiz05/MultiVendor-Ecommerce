const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: {
      type: [String],
      required: true,
      validate: {
        validator: (members) => members.length === 2,
        message: "A conversation must have exactly two members",
      },
    },
    groupTitle: {
      type: String,
      trim: true,
    },
    lastMessage: {
      type: String,
      default: "",
    },
    lastMessageId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

conversationSchema.index({ members: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);
