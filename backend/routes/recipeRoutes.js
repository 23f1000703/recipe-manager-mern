const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("../models/Recipe");

const router = express.Router();

const sendValidationError = (response, error) =>
  response.status(400).json({
    message: "Recipe validation failed.",
    errors: Object.values(error.errors).map((fieldError) => fieldError.message),
  });

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

router.get("/", async (request, response) => {
  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ message: "Database is not connected." });
  }

  try {
    const search =
      typeof request.query.search === "string" ? request.query.search.trim() : "";
    const category =
      typeof request.query.category === "string"
        ? request.query.category.trim()
        : "";
    const difficulty =
      typeof request.query.difficulty === "string"
        ? request.query.difficulty.trim()
        : "";
    const filter = {};

    if (search) {
      filter.title = { $regex: escapeRegex(search), $options: "i" };
    }
    if (category) {
      filter.category = {
        $regex: `^${escapeRegex(category)}$`,
        $options: "i",
      };
    }
    if (difficulty) {
      filter.difficulty = difficulty;
    }

    const recipes = await Recipe.find(filter).sort({ createdAt: -1 });
    return response.status(200).json(recipes);
  } catch {
    return response.status(500).json({ message: "Unable to load recipes." });
  }
});

router.get("/:id", async (request, response) => {
  const { id } = request.params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return response.status(400).json({ message: "Invalid recipe ID." });
  }

  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ message: "Database is not connected." });
  }

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return response.status(404).json({ message: "Recipe not found." });
    }

    return response.status(200).json(recipe);
  } catch {
    return response.status(500).json({ message: "Unable to load recipe." });
  }
});

router.put("/:id", async (request, response) => {
  const { id } = request.params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return response.status(400).json({ message: "Invalid recipe ID." });
  }

  if (
    !request.body ||
    typeof request.body !== "object" ||
    Array.isArray(request.body)
  ) {
    return response.status(400).json({
      message: "Request body must be a JSON object.",
    });
  }

  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ message: "Database is not connected." });
  }

  try {
    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return response.status(404).json({ message: "Recipe not found." });
    }

    recipe.set({
      title: request.body.title,
      category: request.body.category,
      ingredients: request.body.ingredients,
      instructions: request.body.instructions,
      cookingTime: request.body.cookingTime,
      difficulty: request.body.difficulty,
    });

    const updatedRecipe = await recipe.save();
    return response.status(200).json(updatedRecipe);
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendValidationError(response, error);
    }

    if (mongoose.connection.readyState !== 1) {
      return response.status(503).json({ message: "Database is not connected." });
    }

    return response.status(500).json({ message: "Unable to update recipe." });
  }
});

router.delete("/:id", async (request, response) => {
  const { id } = request.params;

  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return response.status(400).json({ message: "Invalid recipe ID." });
  }

  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ message: "Database is not connected." });
  }

  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(id);

    if (!deletedRecipe) {
      return response.status(404).json({ message: "Recipe not found." });
    }

    return response.status(200).json({ message: "Recipe deleted successfully." });
  } catch {
    if (mongoose.connection.readyState !== 1) {
      return response.status(503).json({ message: "Database is not connected." });
    }

    return response.status(500).json({ message: "Unable to delete recipe." });
  }
});

router.post("/", async (request, response) => {
  if (
    !request.body ||
    typeof request.body !== "object" ||
    Array.isArray(request.body)
  ) {
    return response.status(400).json({
      message: "Request body must be a JSON object.",
    });
  }

  const recipe = new Recipe(request.body);

  try {
    await recipe.validate();
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendValidationError(response, error);
    }

    return response.status(500).json({ message: "Unable to validate recipe." });
  }

  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ message: "Database is not connected." });
  }

  try {
    const savedRecipe = await recipe.save();
    return response.status(201).json(savedRecipe);
  } catch (error) {
    if (error.name === "ValidationError") {
      return sendValidationError(response, error);
    }

    if (mongoose.connection.readyState !== 1) {
      return response.status(503).json({ message: "Database is not connected." });
    }

    return response.status(500).json({ message: "Unable to save recipe." });
  }
});

module.exports = router;