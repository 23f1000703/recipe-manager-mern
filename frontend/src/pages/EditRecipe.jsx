import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RecipeForm from '../components/RecipeForm.jsx'
import { getRecipeById, updateRecipe } from '../services/recipeApi.js'

function EditRecipe() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [updatedRecipe, setUpdatedRecipe] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrentRequest = true

    async function loadRecipe() {
      setIsLoading(true)
      setRecipe(null)
      setError(null)

      try {
        const existingRecipe = await getRecipeById(id)
        if (isCurrentRequest) setRecipe(existingRecipe)
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

  if (isLoading) {
    return (
      <main className="recipe-page">
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
      <main className="recipe-page">
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
    <main className="recipe-page edit-page">
      <header className="page-header">
        <Link className="back-link" to={`/recipes/${id}`}>Back to recipe</Link>
        <p className="eyebrow">Recipe Manager</p>
        <h1>Edit recipe</h1>
        <p>Update the recipe details below.</p>
      </header>

      <RecipeForm
        initialRecipe={recipe}
        onSave={(recipeValues) => updateRecipe(id, recipeValues)}
        onSaved={setUpdatedRecipe}
        onChange={() => setUpdatedRecipe(null)}
        submitLabel="Save changes"
        submitBusyLabel="Saving changes..."
        successVerb="Updated"
        resetOnSuccess={false}
      />

      {updatedRecipe && (
        <p className="form-alert form-alert--success" role="status">
          <Link className="text-link" to={`/recipes/${updatedRecipe._id}`}>
            View updated recipe
          </Link>
        </p>
      )}
    </main>
  )
}

export default EditRecipe