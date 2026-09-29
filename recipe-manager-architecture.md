# Recipe Manager — MERN Architecture

## 1. Project Overview

Build a simple **Recipe Manager** using the MERN stack:

- **MongoDB** — database
- **Express.js** — backend web framework
- **React** — frontend
- **Node.js** — backend runtime

This is a **single-user application**.

There are:

- No Admin/User roles
- No role-based authentication
- No login/register system
- No unnecessary microservices
- No complex state-management library

The application allows the user to:

- Add recipes
- View all recipes
- View recipe details
- Edit recipes
- Delete recipes
- Search recipes by name
- Filter recipes by category
- Filter recipes by difficulty

---

# 2. Feature Breakdown

## Feature 1 — Add Recipe

The user can create a recipe containing:

- Recipe title
- Category
- Ingredients
- Cooking instructions
- Cooking time
- Difficulty

Difficulty options:

- Easy
- Medium
- Hard

## Feature 2 — View All Recipes

The home page displays all saved recipes.

Each recipe card should show basic information such as:

- Title
- Category
- Cooking time
- Difficulty

Actions:

- View
- Edit
- Delete

## Feature 3 — View Recipe Details

A dedicated page displays:

- Recipe title
- Category
- Ingredients
- Instructions
- Cooking time
- Difficulty

## Feature 4 — Edit Recipe

The existing recipe is loaded into a form.

The user can modify any editable field and save the changes.

## Feature 5 — Delete Recipe

The user can delete an existing recipe.

A confirmation should be displayed before deletion.

## Feature 6 — Search

The user can search recipes by title/name.

Example:

```text
Search: paneer

Results:
- Paneer Butter Masala
- Paneer Tikka
```

## Feature 7 — Filter

Recipes can be filtered by:

- Category
- Difficulty

Search and filters should be combinable.

Example:

```text
Search: paneer
Category: Indian
Difficulty: Medium
```

---

# 3. Simple Full-Stack Architecture

```text
┌─────────────────────────────────┐
│          React Frontend         │
│                                 │
│  Pages                          │
│  Components                     │
│  Forms                          │
│  Search / Filters               │
│  API Service                    │
└───────────────┬─────────────────┘
                │
                │ HTTP / JSON
                │ REST API
                ▼
┌─────────────────────────────────┐
│       Node.js + Express         │
│                                 │
│  Routes                         │
│  Controllers                    │
│  Validation                     │
│  Mongoose Models                │
└───────────────┬─────────────────┘
                │
                │ Mongoose
                ▼
┌─────────────────────────────────┐
│             MongoDB             │
│                                 │
│          recipes collection     │
└─────────────────────────────────┘
```

## Frontend responsibilities

React handles:

- UI rendering
- Navigation
- Forms
- Client-side input validation
- Search/filter controls
- API requests
- Loading states
- Error states
- Success messages

## Backend responsibilities

Express/Node.js handles:

- REST API
- Server-side validation
- CRUD operations
- Search/filter query handling
- MongoDB communication
- Error responses

## Database responsibilities

MongoDB stores recipe documents.

There is only one main collection:

```text
recipes
```

---

# 4. Recommended Frontend Structure

```text
frontend/
└── src/
    ├── components/
    │   ├── RecipeCard.jsx
    │   ├── RecipeForm.jsx
    │   ├── SearchBar.jsx
    │   └── FilterBar.jsx
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── AddRecipe.jsx
    │   ├── RecipeDetails.jsx
    │   └── EditRecipe.jsx
    │
    ├── services/
    │   └── recipeApi.js
    │
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

Keep the frontend simple.

Do not introduce Redux or another global state-management library unless a real requirement appears later.

For this application, React state and props are sufficient.

---

# 5. Recommended Backend Structure

```text
backend/
├── config/
│   └── db.js
│
├── controllers/
│   └── recipeController.js
│
├── models/
│   └── Recipe.js
│
├── routes/
│   └── recipeRoutes.js
│
├── middleware/
│   └── errorHandler.js
│
├── server.js
├── .env
└── package.json
```

For an initial implementation, the backend can be kept even simpler:

```text
backend/
├── models/
│   └── Recipe.js
├── routes/
│   └── recipeRoutes.js
├── server.js
└── package.json
```

Controllers and middleware can be added when the basic CRUD implementation is working.

---

# 6. Frontend Routes

| Route | Page | Purpose |
|---|---|---|
| `/` | Home | Display recipes, search, and filters |
| `/recipes/new` | Add Recipe | Create a new recipe |
| `/recipes/:id` | Recipe Details | Display complete recipe |
| `/recipes/:id/edit` | Edit Recipe | Edit an existing recipe |

Navigation:

```text
Home
 │
 ├── Add Recipe
 │
 └── Recipe Card
       ├── View
       ├── Edit
       └── Delete
```

---

# 7. Backend API Routes

## Create Recipe

```http
POST /api/recipes
```

Creates a new recipe.

## Get All Recipes

```http
GET /api/recipes
```

Returns all recipes.

Supports optional query parameters:

```http
GET /api/recipes?search=paneer
```

```http
GET /api/recipes?category=Indian
```

```http
GET /api/recipes?difficulty=Easy
```

Combined:

```http
GET /api/recipes?search=paneer&category=Indian&difficulty=Easy
```

## Get Single Recipe

```http
GET /api/recipes/:id
```

## Update Recipe

```http
PUT /api/recipes/:id
```

## Delete Recipe

```http
DELETE /api/recipes/:id
```

The complete API is intentionally small:

```text
POST    /api/recipes
GET     /api/recipes
GET     /api/recipes/:id
PUT     /api/recipes/:id
DELETE  /api/recipes/:id
```

---

# 8. MongoDB Recipe Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `_id` | ObjectId | Automatic | MongoDB document ID |
| `title` | String | Yes | Recipe name |
| `category` | String | Yes | Recipe category |
| `ingredients` | Array of Strings | Yes | List of ingredients |
| `instructions` | String | Yes | Cooking instructions |
| `cookingTime` | Number | Yes | Cooking time in minutes |
| `difficulty` | String | Yes | Easy, Medium, or Hard |
| `createdAt` | Date | Automatic | Creation timestamp |
| `updatedAt` | Date | Automatic | Last update timestamp |

Example:

```json
{
  "title": "Paneer Butter Masala",
  "category": "Indian",
  "ingredients": [
    "Paneer",
    "Tomato",
    "Butter",
    "Cream",
    "Garam masala"
  ],
  "instructions": "Prepare the gravy, add paneer and simmer.",
  "cookingTime": 40,
  "difficulty": "Medium"
}
```

## Validation

### title

- Required
- Trim whitespace
- Must not be empty after trimming

### category

- Required
- Trim whitespace
- Must not be empty

### ingredients

- Required
- Must contain at least one non-empty ingredient

### instructions

- Required
- Must not be empty or whitespace-only

### cookingTime

- Required
- Must be a number
- Must be greater than 0
- Store in minutes

### difficulty

Only these values are valid:

```text
Easy
Medium
Hard
```

---

# 9. CRUD Flow

## Create

```text
React Add Recipe Form
        ↓
POST /api/recipes
        ↓
Express validation
        ↓
Recipe model
        ↓
MongoDB
        ↓
JSON response
        ↓
React
```

## Read All

```text
React Home Page
        ↓
GET /api/recipes
        ↓
Express
        ↓
MongoDB
        ↓
Recipe documents
        ↓
JSON
        ↓
React Recipe Cards
```

## Read One

```text
Recipe Details Page
        ↓
GET /api/recipes/:id
        ↓
MongoDB
        ↓
Single Recipe
        ↓
React
```

## Update

```text
Edit Page
        ↓
GET /api/recipes/:id
        ↓
Populate form
        ↓
User edits data
        ↓
PUT /api/recipes/:id
        ↓
MongoDB update
        ↓
Updated recipe
```

## Delete

```text
User clicks Delete
        ↓
Confirmation
        ↓
DELETE /api/recipes/:id
        ↓
MongoDB
        ↓
Success response
        ↓
Refresh/update recipe list
```

---

# 10. Search and Filtering

Use query parameters rather than creating separate API endpoints.

Examples:

```text
GET /api/recipes?search=paneer
```

```text
GET /api/recipes?category=Indian
```

```text
GET /api/recipes?difficulty=Easy
```

Combined:

```text
GET /api/recipes?search=paneer&category=Indian&difficulty=Easy
```

The backend should apply only the filters that are supplied.

If no filters are supplied:

```text
GET /api/recipes
```

returns all recipes.

---

# 11. Edge Cases

## Validation

Handle:

- Empty recipe title
- Title containing only spaces
- Empty category
- Empty ingredients
- Ingredients containing only spaces
- Empty instructions
- Instructions containing only spaces
- Missing cooking time
- Zero cooking time
- Negative cooking time
- Non-numeric cooking time
- Invalid difficulty
- Missing required fields

## Recipe ID

Handle:

- Invalid MongoDB ID format
- Valid ID for a recipe that does not exist

Expected behavior:

```text
Invalid ID → 400 Bad Request
Valid but nonexistent ID → 404 Not Found
```

## Update

Handle:

- Editing a nonexistent recipe
- Invalid recipe ID
- Invalid updated data

## Delete

Handle:

- Deleting a nonexistent recipe
- Invalid recipe ID

## Empty states

Handle:

- No recipes in database
- No search results
- No recipes matching category
- No recipes matching difficulty
- No recipes matching combined filters

Example:

```text
No recipes found.
```

---

# 12. Development Order

Build incrementally.

## Step 1 — Project setup

Create:

```text
recipe-manager/
├── frontend/
└── backend/
```

Set up React, Express, Node.js, and MongoDB.

### Test

- React starts
- Express starts
- MongoDB connects
- Test backend endpoint works

---

## Step 2 — Recipe model

Create the Mongoose Recipe model and validation.

### Test

Create valid and invalid recipe data and verify validation.

---

## Step 3 — Create API

Implement:

```http
POST /api/recipes
```

### Test

Use Postman or another API client to create a recipe.

Verify it exists in MongoDB.

---

## Step 4 — Add Recipe UI

Create:

```text
/recipes/new
```

Connect the form to the API.

### Test

Create a recipe from the browser and verify it appears in MongoDB.

---

## Step 5 — Get All Recipes

Implement:

```http
GET /api/recipes
```

Build the Home page.

### Test

Create several recipes and confirm they all appear.

---

## Step 6 — Recipe Details

Implement:

```http
GET /api/recipes/:id
```

Create:

```text
/recipes/:id
```

### Test

Open different recipes and verify that the correct data is displayed.

---

## Step 7 — Edit

Implement:

```http
PUT /api/recipes/:id
```

Create:

```text
/recipes/:id/edit
```

### Test

Edit several fields and verify MongoDB and the UI contain the updated values.

---

## Step 8 — Delete

Implement:

```http
DELETE /api/recipes/:id
```

Add confirmation.

### Test

Delete recipes and verify they disappear from both the UI and database.

---

## Step 9 — Search

Add title search.

### Test

Test:

- Full title
- Partial title
- Different capitalization
- No matching title

---

## Step 10 — Filters

Add:

- Category filter
- Difficulty filter

Then support combinations.

### Test

Test each filter independently and together with search.

---

## Step 11 — UI improvements

After functionality is complete:

- Loading indicators
- Error messages
- Empty states
- Delete confirmation
- Responsive design
- Better recipe cards
- Form styling

---

# 13. Testing Checklist

## Backend

- [ ] Create valid recipe
- [ ] Reject empty title
- [ ] Reject whitespace-only title
- [ ] Reject empty ingredients
- [ ] Reject empty instructions
- [ ] Reject invalid cooking time
- [ ] Reject invalid difficulty
- [ ] Get all recipes
- [ ] Get one recipe
- [ ] Handle invalid ID
- [ ] Handle nonexistent recipe
- [ ] Update recipe
- [ ] Delete recipe
- [ ] Search by title
- [ ] Filter by category
- [ ] Filter by difficulty
- [ ] Combine search and filters

## Frontend

- [ ] Add recipe form works
- [ ] Form validation works
- [ ] Recipe list displays correctly
- [ ] Recipe details page works
- [ ] Edit form loads existing data
- [ ] Edit saves correctly
- [ ] Delete confirmation works
- [ ] Delete updates the UI
- [ ] Search works
- [ ] Category filter works
- [ ] Difficulty filter works
- [ ] Combined filters work
- [ ] Loading state works
- [ ] Error state works
- [ ] Empty state works

---

# 14. Initial Prompt for Coding Agent

Copy the following prompt into the coding agent **before asking it to write implementation code**:

```text
You are going to build a simple Recipe Manager application using the MERN stack:

- MongoDB
- Express.js
- React
- Node.js

Project requirements:

This is a SINGLE-USER application.

There must be:
- No Admin/User roles
- No role-based authentication
- No login/register system
- No microservices
- No unnecessary libraries
- No unnecessary architecture
- No Redux or complex state-management unless genuinely required

The user should be able to:

1. Add a recipe
2. Enter recipe title/name
3. Add a category
4. Add ingredients
5. Add cooking instructions
6. Add cooking time in minutes
7. Select difficulty:
   - Easy
   - Medium
   - Hard
8. View all saved recipes
9. View complete recipe details
10. Edit an existing recipe
11. Delete a recipe
12. Search recipes by title
13. Filter recipes by category
14. Filter recipes by difficulty
15. Combine search and filters

Use this architecture:

Frontend:
- React
- React Router for page navigation
- React state/props for application state
- A small API service module for backend requests

Backend:
- Node.js
- Express.js
- Mongoose
- REST API

Database:
- MongoDB
- One main collection: recipes

Frontend routes:

/
  Home page

/recipes/new
  Add recipe page

/recipes/:id
  Recipe details page

/recipes/:id/edit
  Edit recipe page

Backend API:

POST   /api/recipes
GET    /api/recipes
GET    /api/recipes/:id
PUT    /api/recipes/:id
DELETE /api/recipes/:id

GET /api/recipes must support optional query parameters:

search
category
difficulty

Examples:

GET /api/recipes?search=paneer

GET /api/recipes?category=Indian

GET /api/recipes?difficulty=Easy

GET /api/recipes?search=paneer&category=Indian&difficulty=Easy

Recipe schema:

title:
- String
- required
- trim whitespace

category:
- String
- required
- trim whitespace

ingredients:
- Array of Strings
- required
- at least one non-empty ingredient

instructions:
- String
- required
- must not be empty or whitespace-only

cookingTime:
- Number
- required
- greater than 0
- measured in minutes

difficulty:
- String
- required
- enum: Easy, Medium, Hard

createdAt:
- Date
- automatic

updatedAt:
- Date
- automatic

The MongoDB document should look conceptually like:

{
  "title": "Paneer Butter Masala",
  "category": "Indian",
  "ingredients": [
    "Paneer",
    "Tomato",
    "Butter"
  ],
  "instructions": "Prepare the gravy and cook the paneer.",
  "cookingTime": 40,
  "difficulty": "Medium"
}

Suggested frontend structure:

frontend/
└── src/
    ├── components/
    │   ├── RecipeCard.jsx
    │   ├── RecipeForm.jsx
    │   ├── SearchBar.jsx
    │   └── FilterBar.jsx
    ├── pages/
    │   ├── Home.jsx
    │   ├── AddRecipe.jsx
    │   ├── RecipeDetails.jsx
    │   └── EditRecipe.jsx
    ├── services/
    │   └── recipeApi.js
    ├── App.jsx
    ├── main.jsx
    └── index.css

Suggested backend structure:

backend/
├── config/
│   └── db.js
├── controllers/
│   └── recipeController.js
├── models/
│   └── Recipe.js
├── routes/
│   └── recipeRoutes.js
├── middleware/
│   └── errorHandler.js
├── server.js
├── .env
└── package.json

Development requirements:

1. Do NOT generate the entire application in one step.

2. Work incrementally.

3. First inspect the existing project structure if files already exist.

4. Before implementing each feature:
   - Explain briefly what you are going to change.
   - Identify the files that will be created or modified.
   - Keep the implementation beginner-friendly.

5. Build in this order:

   Step 1:
   Project setup and MongoDB connection.

   Step 2:
   Recipe Mongoose model and validation.

   Step 3:
   POST /api/recipes.

   Step 4:
   React Add Recipe page and form.

   Step 5:
   GET /api/recipes and Home page.

   Step 6:
   GET /api/recipes/:id and Recipe Details page.

   Step 7:
   PUT /api/recipes/:id and Edit page.

   Step 8:
   DELETE /api/recipes/:id.

   Step 9:
   Search by recipe title.

   Step 10:
   Category and difficulty filters.

   Step 11:
   Loading states, error states, empty states, confirmation dialogs, and UI polish.

6. After completing each step, provide a short testing checklist before moving to the next step.

7. Do not move to the next feature if the current feature is broken.

8. Handle these edge cases:

   - Empty title
   - Whitespace-only title
   - Empty category
   - Empty ingredients
   - Empty/whitespace-only ingredients
   - Empty instructions
   - Invalid cooking time
   - Zero cooking time
   - Negative cooking time
   - Invalid difficulty
   - Invalid MongoDB recipe ID
   - Recipe ID does not exist
   - Editing nonexistent recipe
   - Deleting nonexistent recipe
   - No recipes available
   - No search results
   - No recipes matching filters

9. Use appropriate HTTP status codes.

For example:

201 Created
400 Bad Request
404 Not Found
500 Internal Server Error

10. Return clear JSON responses for API errors.

11. Keep the code readable and suitable for a beginner/intermediate MERN developer.

12. Do not over-engineer the application.

13. Do not add authentication.

14. Do not add Admin/User roles.

15. Do not add unnecessary abstractions.

16. Do not add a separate database collection for categories or ingredients.

17. Ingredients should remain an array inside the Recipe document.

18. Use environment variables for sensitive/configuration values such as:

MONGODB_URI
PORT

19. Do not hard-code the MongoDB connection string.

20. The frontend should communicate with the backend through REST API calls.

21. Keep frontend and backend clearly separated.

22. Use proper error handling on both frontend and backend.

23. For delete operations, the frontend should ask for confirmation before sending the DELETE request.

24. Search and filtering should use backend query parameters rather than downloading every recipe and implementing all filtering only on the frontend.

25. Do not introduce pagination initially. Keep the first version simple.

Important coding-agent behavior:

- Do not assume files exist.
- Inspect the project before modifying it.
- Do not overwrite existing files unnecessarily.
- Explain changes briefly.
- Make small, testable changes.
- After each major change, tell me exactly how to run/test it.
- If there is an error, diagnose the existing implementation before adding more code.
- Prefer simple code over clever code.
- Follow the architecture above unless there is a concrete technical reason to change it.

Start with ONLY Step 1: project setup and MongoDB connection.

Do not implement the complete application yet.
```

---

# 15. Recommended Final Project Structure

Once everything is completed, the project should look approximately like:

```text
recipe-manager/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecipeCard.jsx
│   │   │   ├── RecipeForm.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── FilterBar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── AddRecipe.jsx
│   │   │   ├── RecipeDetails.jsx
│   │   │   └── EditRecipe.jsx
│   │   │
│   │   ├── services/
│   │   │   └── recipeApi.js
│   │   │
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   └── recipeController.js
│   │
│   ├── models/
│   │   └── Recipe.js
│   │
│   ├── routes/
│   │   └── recipeRoutes.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── README.md
```

This is intentionally a small MERN project that is easy to understand, debug, explain in an interview, and extend later.
