const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    savedPreferences: [
      {
        name: String,
        budget: Object,
        style: [String],
        objectives: String,
      },
    ],

    username: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    playStyle: {
      type: String,
      default: "Versatile",
    },
    position: {
      type: String,
      default: "Entrambe",
    },
    skillLevel: {
      type: String,
      default: "Intermedio",
    },
    gear: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
