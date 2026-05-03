const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    preferences: {
      budget: {
        min: Number,
        max: Number,
      },
      skillLevel: String,
      racketType: String,
      objectives: String,
      specialRequests: String,
    },
    recommendedProducts: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        reasoning: String,
      },
    ],
    geminiResponse: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Recommendation", recommendationSchema);
