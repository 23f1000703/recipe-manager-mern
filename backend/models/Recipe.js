const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required."],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Recipe category is required."],
      trim: true,
    },
    ingredients: {
      type: [{ type: String, trim: true }],
      required: [true, "At least one ingredient is required."],
      validate: {
        validator: (ingredients) =>
          Array.isArray(ingredients) &&
          ingredients.some((ingredient) => ingredient.length > 0),
        message: "At least one non-empty ingredient is required.",
      },
    },
    instructions: {
      type: String,
      required: [true, "Cooking instructions are required."],
      trim: true,
    },
    cookingTime: {
      type: Number,
      required: [true, "Cooking time is required."],
      min: [Number.MIN_VALUE, "Cooking time must be greater than 0."],
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty is required."],
      enum: {
        values: ["Easy", "Medium", "Hard"],
        message: "Difficulty must be Easy, Medium, or Hard.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);