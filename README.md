# Recipe Manager

A simple single-user recipe manager built with MongoDB, Express, React, and Node.js. Save recipes, browse their details, edit or delete them, and find recipes by title, category, or difficulty.

## Features

- Create, view, edit, and delete recipes
- Store title, category, ingredients, instructions, cooking time, and difficulty
- Search titles by partial, case-insensitive text
- Filter by category and difficulty, alone or combined with search
- Validate recipe fields in both the browser and backend
- Show loading, error, empty, and successful-action states
- Ask for confirmation before deleting a recipe

## Tech Stack

- MongoDB with Mongoose
- Node.js and Express
- React and React Router
- Vite for the frontend development server and production build

## Project Structure

```text
backend/
  config/db.js              MongoDB connection
  models/Recipe.js          Recipe schema and validation
  routes/recipeRoutes.js    Recipe REST API
  server.js                 Express server and health endpoint
  .env.example              Environment variable template
frontend/
  src/components/           Recipe card and shared form
  src/pages/                Home, add, details, and edit pages
  src/services/recipeApi.js Frontend API requests
  src/App.jsx               Client-side routes
recipe-manager-architecture.md
```

## Prerequisites

- Node.js 20.19+ or 22.12+ and npm
- A local MongoDB server, or a MongoDB Atlas cluster

Check the installed versions with `node --version` and `npm --version`.

## MongoDB Setup

For local MongoDB, start the MongoDB service on your machine. The example connection URI uses the `recipe_manager` database; MongoDB creates it when the application first stores a recipe.

For MongoDB Atlas:

1. Create a cluster and a database user in Atlas.
2. Allow your development machine in Atlas Network Access.
3. Copy the cluster connection URI and replace its username, password, and host placeholders.
4. Put that URI in `backend/.env` as `MONGODB_URI`.

Never commit `.env` or put database credentials in frontend code. The backend `.gitignore` excludes `.env`.

## Environment Variables

Create `backend/.env` from the provided template:

```powershell
Copy-Item backend/.env.example backend/.env
```

Set the backend variables in `backend/.env`:

| Variable | Required | Description | Example |
| --- | --- | --- | --- |
| `MONGODB_URI` | Yes | Local or Atlas MongoDB connection URI | `mongodb://127.0.0.1:27017/recipe_manager` |
| `PORT` | No | Express server port; defaults to `5000` | `5000` |
| `VITE_API_URL` | No | Frontend API base URL; defaults to `http://localhost:5000/api` | `http://localhost:5000/api` |

To override the frontend API URL, add `VITE_API_URL` to `frontend/.env`. That file is ignored by Git. Only use public, non-secret values in variables prefixed with `VITE_`.

## Run the Backend

In a terminal from the project root:

```powershell
cd backend
npm install
npm run dev
```

The server starts at `http://localhost:5000`. Check it at `http://localhost:5000/api/health`; the response includes the database connection state. For a non-watching start, use `npm start`.

## Run the Frontend

In a second terminal from the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## API Endpoints

All recipe endpoints are prefixed with `/api` and exchange JSON.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check the backend and database connection state |
| `POST` | `/api/recipes` | Create a recipe |
| `GET` | `/api/recipes` | List recipes; optional `search`, `category`, and `difficulty` query parameters can be combined |
| `GET` | `/api/recipes/:id` | Get one recipe by MongoDB ID |
| `PUT` | `/api/recipes/:id` | Update a recipe |
| `DELETE` | `/api/recipes/:id` | Delete a recipe |

Examples:

```text
GET /api/recipes?search=paneer
GET /api/recipes?category=Indian&difficulty=Easy
GET /api/recipes?search=paneer&category=Indian&difficulty=Easy
```

Title search is partial and case-insensitive. Category matching is exact and case-insensitive. Difficulty is `Easy`, `Medium`, or `Hard`. The list is ordered newest first.

## Basic Usage

1. Start MongoDB, then start the backend and frontend in separate terminals.
2. Open the frontend and choose **Add a recipe**.
3. Enter the recipe fields and save it.
4. Browse saved recipes on Home; use the search and filters to narrow the list.
5. Choose **View recipe** for complete details, **Edit** to update it, or **Delete** to remove it after confirming.

This is a local single-user application. It does not include authentication or pagination.