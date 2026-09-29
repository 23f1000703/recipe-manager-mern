import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { deleteRecipe, getRecipeById } from '../services/recipeApi.js'

function RecipeDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState('')
  const deleteRequestStarted = useRef(false)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadRecipe() {
      setIsLoading(true)
      setRecipe(null)
      setError(null)

      try {
        const recipeDetails = await getRecipeById(id)
        if (isCurrentRequest) setRecipe(recipeDetails)
      } catch (loadError) {
        if (isCurrentRequest) setError(loadError)
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    loadRecipe()

    return () => {
      isCurrentRequest = false
    }
  }, [id])

  async function handleDelete() {
    if (deleteRequestStarted.current) return

    const confirmed = window.confirm(
      `Delete "${recipe.title}"? This permanently removes the recipe and cannot be undone.`,
    )

    if (!confirmed) return

    deleteRequestStarted.current = true
    setIsDeleting(true)
    setDeleteError('')

    try {
      await deleteRecipe(id)
      navigate('/', {
        state: { successMessage: `"${recipe.title}" was deleted.` },
      })
    } catch (deleteRequestError) {
      deleteRequestStarted.current = false
      setDeleteError(deleteRequestError.message)
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <main className="recipe-page details-page">
        <Link className="back-link" to="/">All recipes</Link>
        <p className="loading-state" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Loading recipe...</span>
        </p>
      </main>
    )
  }

  if (error) {
    const isNotFound = error.status === 400 || error.status === 404

    return (
      <main className="recipe-page details-page">
        <Link className="back-link" to="/">All recipes</Link>
        <section className="home-state home-state--error" role="alert">
          <h1>{isNotFound ? 'Recipe not found' : 'Recipe could not be loaded'}</h1>
          <p>{error.message}</p>
          <Link className="text-link" to="/">Return to home</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="recipe-page details-page">
      <header className="page-header">
        <div className="details-page-links">
          <Link className="back-link" to="/">All recipes</Link>
          <div className="details-actions">
            <Link className="details-edit-link" to={`/recipes/${recipe._id}/edit`}>
              Edit
            </Link>
            <button
              className="details-delete-button"
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
        <p className="eyebrow">{recipe.category}</p>
        <h1>{recipe.title}</h1>
      </header>

      {deleteError && (
        <p className="form-alert form-alert--error" role="alert">{deleteError}</p>
      )}

      <div className="recipe-details-meta">
        <p><strong>Cooking time:</strong> {recipe.cookingTime} minutes</p>
        <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
      </div>

      <section className="details-section" aria-labelledby="details-ingredients-heading">
        <h2 id="details-ingredients-heading">Ingredients</h2>
        <ul className="details-ingredients">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={`${ingredient}-${index}`}>{ingredient}</li>
          ))}
        </ul>
      </section>

      <section className="details-section" aria-labelledby="details-instructions-heading">
        <h2 id="details-instructions-heading">Cooking instructions</h2>
        <p className="details-instructions">{recipe.instructions}</p>
      </section>
    </main>
  )
}

export default RecipeDetails