import { Link } from 'react-router-dom'

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <div className="recipe-card-header">
        <div>
          <p className="recipe-card-category">{recipe.category}</p>
          <h2>{recipe.title}</h2>
        </div>
        <span className="difficulty-label">{recipe.difficulty}</span>
      </div>
      <p className="recipe-card-time">{recipe.cookingTime} minutes</p>
      <Link className="recipe-card-link" to={`/recipes/${recipe._id}`}>
        View recipe
      </Link>
    </article>
  )
}

export default RecipeCard