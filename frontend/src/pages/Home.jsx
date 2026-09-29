import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard.jsx'
import { getRecipes } from '../services/recipeApi.js'

function Home() {
  const location = useLocation()
  const [recipes, setRecipes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadCount, setReloadCount] = useState(0)
  const [searchInput, setSearchInput] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [difficultyInput, setDifficultyInput] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const hasActiveFilters = Boolean(searchTerm || categoryFilter || difficultyFilter)
  const hasFilterInput = Boolean(
    searchInput || categoryInput || difficultyInput || hasActiveFilters,
  )

  useEffect(() => {
    let isCurrentRequest = true

    async function loadRecipes() {
      setIsLoading(true)
      setError('')

      try {
        const recipeList = await getRecipes(searchTerm, categoryFilter, difficultyFilter)
        if (isCurrentRequest) setRecipes(recipeList)
      } catch (loadError) {
        if (isCurrentRequest) setError(loadError.message)
      } finally {
        if (isCurrentRequest) setIsLoading(false)
      }
    }

    loadRecipes()

    return () => {
      isCurrentRequest = false
    }
  }, [reloadCount, searchTerm, categoryFilter, difficultyFilter])

  function handleFilterSubmit(event) {
    event.preventDefault()
    setSearchTerm(searchInput.trim())
    setCategoryFilter(categoryInput.trim())
    setDifficultyFilter(difficultyInput.trim())
  }

  function clearFilters() {
    setSearchInput('')
    setSearchTerm('')
    setCategoryInput('')
    setCategoryFilter('')
    setDifficultyInput('')
    setDifficultyFilter('')
  }

  return (
    <main className="home-page">
      <header className="home-header">
        <div>
          <p className="eyebrow">Recipe Manager</p>
          <h1>Your recipes</h1>
        </div>
        <Link className="submit-button home-add-link" to="/recipes/new">
          Add a recipe
        </Link>
      </header>

      <form
        className="recipe-search"
        role="search"
        aria-busy={isLoading}
        onSubmit={handleFilterSubmit}
      >
        <div className="field">
          <label htmlFor="recipe-search">Search by recipe title</label>
          <input
            id="recipe-search"
            name="search"
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Enter a recipe name"
          />
        </div>
        <div className="field">
          <label htmlFor="recipe-category">Category</label>
          <input
            id="recipe-category"
            name="category"
            type="text"
            value={categoryInput}
            onChange={(event) => setCategoryInput(event.target.value)}
            placeholder="For example, Indian"
          />
        </div>
        <div className="field">
          <label htmlFor="recipe-difficulty">Difficulty</label>
          <select
            id="recipe-difficulty"
            name="difficulty"
            value={difficultyInput}
            onChange={(event) => setDifficultyInput(event.target.value)}
          >
            <option value="">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div className="search-actions">
          <button className="submit-button search-submit" type="submit" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Apply filters'}
          </button>
          {hasFilterInput && (
            <button className="text-button search-clear" type="button" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </form>

      {location.state?.successMessage && (
        <p className="form-alert form-alert--success home-success-message" role="status">
          {location.state.successMessage}
        </p>
      )}

      {isLoading && (
        <p className="loading-state" role="status">
          <span className="loading-spinner" aria-hidden="true" />
          <span>{hasActiveFilters ? 'Loading matching recipes...' : 'Loading recipes...'}</span>
        </p>
      )}

      {!isLoading && error && (
        <section className="home-state home-state--error" role="alert">
          <h2>Recipes could not be loaded</h2>
          <p>{error}</p>
          <button
            className="text-button retry-button"
            type="button"
            onClick={() => setReloadCount((count) => count + 1)}
          >
            Try again
          </button>
        </section>
      )}

      {!isLoading && !error && recipes.length === 0 && !hasActiveFilters && (
        <section className="home-state" role="status">
          <h2>No recipes yet</h2>
          <p>Add your first recipe to start your collection.</p>
          <Link className="text-link" to="/recipes/new">Add a recipe</Link>
        </section>
      )}

      {!isLoading && !error && recipes.length === 0 && hasActiveFilters && (
        <section className="home-state" role="status">
          <h2>No matching recipes</h2>
          <p>Try changing or clearing the selected filters.</p>
          <button className="text-button retry-button" type="button" onClick={clearFilters}>
            Clear filters
          </button>
        </section>
      )}

      {!isLoading && !error && recipes.length > 0 && (
        <section className="recipe-list" aria-label="Saved recipes">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </section>
      )}
    </main>
  )
}

export default Home