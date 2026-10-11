const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: String,
      required: true,
      index: true,
    },
    text: {
      type: String,
      trim: true,
      maxlength: 5000,
    },
    images: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

messagesSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model("Messages", messagesSchema);
