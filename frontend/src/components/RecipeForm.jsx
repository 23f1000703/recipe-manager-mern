import { useRef, useState } from 'react'
import { createRecipe } from '../services/recipeApi.js'

const emptyRecipe = {
  title: '',
  category: '',
  ingredients: [''],
  instructions: '',
  cookingTime: '',
  difficulty: '',
}

function getFormValues(recipe) {
  return {
    title: recipe.title || '',
    category: recipe.category || '',
    ingredients: recipe.ingredients?.length ? [...recipe.ingredients] : [''],
    instructions: recipe.instructions || '',
    cookingTime: recipe.cookingTime == null ? '' : String(recipe.cookingTime),
    difficulty: recipe.difficulty || '',
  }
}

function validateRecipe(recipe) {
  const errors = {}

  if (!recipe.title.trim()) errors.title = 'Enter a recipe title.'
  if (!recipe.category.trim()) errors.category = 'Enter a category.'
  if (!recipe.ingredients.some((ingredient) => ingredient.trim())) {
    errors.ingredients = 'Add at least one non-empty ingredient.'
  }
  if (!recipe.instructions.trim()) {
    errors.instructions = 'Enter cooking instructions.'
  }

  const cookingTime = Number(recipe.cookingTime)
  if (!recipe.cookingTime.trim() || !Number.isFinite(cookingTime)) {
    errors.cookingTime = 'Enter cooking time in minutes.'
  } else if (cookingTime <= 0) {
    errors.cookingTime = 'Cooking time must be greater than zero.'
  }

  if (!['Easy', 'Medium', 'Hard'].includes(recipe.difficulty)) {
    errors.difficulty = 'Choose a difficulty.'
  }

  return errors
}

function RecipeForm({
  initialRecipe = emptyRecipe,
  onSave = createRecipe,
  onSaved,
  onChange,
  submitLabel = 'Save recipe',
  successVerb = 'Saved',
  submitBusyLabel = 'Saving recipe...',
  resetOnSuccess = true,
}) {
  const [recipe, setRecipe] = useState(() => getFormValues(initialRecipe))
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const submissionStarted = useRef(false)

  function clearSubmissionMessages() {
    setSubmitError('')
    setSuccessMessage('')
    onChange?.()
  }

  function updateField(field, value) {
    setRecipe((currentRecipe) => ({ ...currentRecipe, [field]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [field]: '' }))
    clearSubmissionMessages()
  }

  function updateIngredient(index, value) {
    setRecipe((currentRecipe) => ({
      ...currentRecipe,
      ingredients: currentRecipe.ingredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? value : ingredient,
      ),
    }))
    setErrors((currentErrors) => ({ ...currentErrors, ingredients: '' }))
    clearSubmissionMessages()
  }

  function addIngredient() {
    setRecipe((currentRecipe) => ({
      ...currentRecipe,
      ingredients: [...currentRecipe.ingredients, ''],
    }))
    setErrors((currentErrors) => ({ ...currentErrors, ingredients: '' }))
    clearSubmissionMessages()
  }

  function removeIngredient(index) {
    setRecipe((currentRecipe) => ({
      ...currentRecipe,
      ingredients: currentRecipe.ingredients.filter(
        (_, ingredientIndex) => ingredientIndex !== index,
      ),
    }))
    setErrors((currentErrors) => ({ ...currentErrors, ingredients: '' }))
    clearSubmissionMessages()
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submissionStarted.current) return

    setSubmitError('')
    setSuccessMessage('')

    const validationErrors = validateRecipe(recipe)
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    submissionStarted.current = true
    setIsSubmitting(true)
    try {
      const savedRecipe = await onSave({
        title: recipe.title.trim(),
        category: recipe.category.trim(),
        ingredients: recipe.ingredients
          .map((ingredient) => ingredient.trim())
          .filter(Boolean),
        instructions: recipe.instructions.trim(),
        cookingTime: Number(recipe.cookingTime),
        difficulty: recipe.difficulty,
      })
      setSuccessMessage(`${successVerb} "${savedRecipe.title}".`)
      if (resetOnSuccess) setRecipe(getFormValues(emptyRecipe))
      setErrors({})
      onSaved?.(savedRecipe)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      submissionStarted.current = false
      setIsSubmitting(false)
    }
  }

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
      <section className="form-section" aria-labelledby="recipe-basics-heading">
        <h2 id="recipe-basics-heading">Recipe basics</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="title">Recipe title</label>
            <input
              id="title"
              name="title"
              value={recipe.title}
              onChange={(event) => updateField('title', event.target.value)}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
              autoComplete="off"
            />
            {errors.title && <p className="field-error" id="title-error">{errors.title}</p>}
          </div>

          <div className="field">
            <label htmlFor="category">Category</label>
            <input
              id="category"
              name="category"
              value={recipe.category}
              onChange={(event) => updateField('category', event.target.value)}
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'category-error' : undefined}
              placeholder="For example, Indian"
            />
            {errors.category && <p className="field-error" id="category-error">{errors.category}</p>}
          </div>
        </div>
      </section>

      <section className="form-section" aria-labelledby="ingredients-heading">
        <h2 id="ingredients-heading">Ingredients</h2>
        <div className="ingredients-list">
          {recipe.ingredients.map((ingredient, index) => (
            <div className="ingredient-row" key={index}>
              <div className="field">
                <label className="visually-hidden" htmlFor={`ingredient-${index}`}>
                  Ingredient {index + 1}
                </label>
                <input
                  id={`ingredient-${index}`}
                  value={ingredient}
                  onChange={(event) => updateIngredient(index, event.target.value)}
                  aria-invalid={Boolean(errors.ingredients)}
                  aria-describedby={errors.ingredients ? 'ingredients-error' : undefined}
                  placeholder={`Ingredient ${index + 1}`}
                />
              </div>
              <button
                className="text-button"
                type="button"
                onClick={() => removeIngredient(index)}
                disabled={recipe.ingredients.length === 1}
                aria-label={`Remove ingredient ${index + 1}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        {errors.ingredients && (
          <p className="field-error" id="ingredients-error">{errors.ingredients}</p>
        )}
        <button className="text-button add-ingredient" type="button" onClick={addIngredient}>
          + Add another ingredient
        </button>
      </section>

      <section className="form-section" aria-labelledby="method-heading">
        <h2 id="method-heading">Cooking method</h2>
        <div className="field">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={(event) => updateField('instructions', event.target.value)}
            aria-invalid={Boolean(errors.instructions)}
            aria-describedby={errors.instructions ? 'instructions-error' : undefined}
            rows="5"
          />
          {errors.instructions && (
            <p className="field-error" id="instructions-error">{errors.instructions}</p>
          )}
        </div>
      </section>

      <section className="form-section" aria-labelledby="timing-heading">
        <h2 id="timing-heading">Time and difficulty</h2>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="cookingTime">Cooking time (minutes)</label>
            <input
              id="cookingTime"
              name="cookingTime"
              type="number"
              min="0.01"
              step="any"
              value={recipe.cookingTime}
              onChange={(event) => updateField('cookingTime', event.target.value)}
              aria-invalid={Boolean(errors.cookingTime)}
              aria-describedby={errors.cookingTime ? 'cooking-time-error' : undefined}
            />
            {errors.cookingTime && (
              <p className="field-error" id="cooking-time-error">{errors.cookingTime}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={recipe.difficulty}
              onChange={(event) => updateField('difficulty', event.target.value)}
              aria-invalid={Boolean(errors.difficulty)}
              aria-describedby={errors.difficulty ? 'difficulty-error' : undefined}
            >
              <option value="">Choose difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {errors.difficulty && (
              <p className="field-error" id="difficulty-error">{errors.difficulty}</p>
            )}
          </div>
        </div>
      </section>

      {submitError && (
        <p className="form-alert form-alert--error" role="alert">{submitError}</p>
      )}
      {successMessage && (
        <p className="form-alert form-alert--success" role="status">{successMessage}</p>
      )}

      <div className="form-footer">
        <button
          className="submit-button"
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting && <span className="loading-spinner loading-spinner--button" aria-hidden="true" />}
          {isSubmitting ? submitBusyLabel : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default RecipeForm