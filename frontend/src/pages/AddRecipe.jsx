import { Link } from 'react-router-dom'
import RecipeForm from '../components/RecipeForm.jsx'

function AddRecipe() {
  return (
    <main className="recipe-page">
      <header className="page-header">
        <Link className="back-link" to="/">All recipes</Link>
        <p className="eyebrow">Recipe Manager</p>
        <h1>Add a recipe</h1>
        <p>Write down the ingredients and steps so it is ready for next time.</p>
      </header>
      <RecipeForm />
    </main>
  )
}

export default AddRecipe