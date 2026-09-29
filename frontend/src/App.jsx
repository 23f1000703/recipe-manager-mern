import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AddRecipe from './pages/AddRecipe.jsx'
import Home from './pages/Home.jsx'
import RecipeDetails from './pages/RecipeDetails.jsx'
import EditRecipe from './pages/EditRecipe.jsx'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipes/new" element={<AddRecipe />} />
        <Route path="/recipes/:id/edit" element={<EditRecipe />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
