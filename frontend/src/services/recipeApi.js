const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function getRecipes(search = '', category = '', difficulty = '') {
  const queryParams = new URLSearchParams()
  const filters = { search, category, difficulty }

  for (const [name, value] of Object.entries(filters)) {
    if (typeof value === 'string' && value.trim()) {
      queryParams.set(name, value.trim())
    }
  }

  const query = queryParams.toString()
  let response

  try {
    response = await fetch(`${API_BASE_URL}/recipes${query ? `?${query}` : ''}`)
  } catch {
    throw new Error('Could not reach the server. Check that the backend is running.')
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(result.message || 'Could not load recipes.')
  }

  if (!Array.isArray(result)) {
    throw new Error('The server returned an invalid recipe list.')
  }

  return result
}

export async function getRecipeById(id) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/recipes/${encodeURIComponent(id)}`)
  } catch {
    throw new Error('Could not reach the server. Check that the backend is running.')
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(result.message || 'Could not load recipe.')
    error.status = response.status
    throw error
  }

  return result
}

export async function createRecipe(recipe) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    })
  } catch {
    throw new Error('Could not reach the server. Check that the backend is running.')
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const details = Array.isArray(result.errors) ? result.errors.join(' ') : ''
    throw new Error(details || result.message || 'Could not save the recipe.')
  }

  return result
}

export async function updateRecipe(id, recipe) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/recipes/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    })
  } catch {
    throw new Error('Could not reach the server. Check that the backend is running.')
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const details = Array.isArray(result.errors) ? result.errors.join(' ') : ''
    const error = new Error(details || result.message || 'Could not update recipe.')
    error.status = response.status
    throw error
  }

  return result
}

export async function deleteRecipe(id) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/recipes/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    })
  } catch {
    throw new Error('Could not reach the server. Check that the backend is running.')
  }

  const result = await response.json().catch(() => ({}))

  if (!response.ok) {
    const error = new Error(result.message || 'Could not delete recipe.')
    error.status = response.status
    throw error
  }

  return result
}