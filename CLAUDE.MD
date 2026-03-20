# CLAUDE.md — conduit-backend

This is the backend API for the Conduit demo app (a Medium clone). Node.js + Express + Mongoose + JWT auth.

## What this repo is

A REST API that powers the Conduit frontend. It handles user registration/login, article CRUD, comments, favourites, and user following. The API spec is defined at https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction.

## Key directories

```
src/
  app.js              # Express app setup, middleware registration
  config/             # Environment config
  models/             # Mongoose schemas: User, Article, Comment
  routes/             # Express routers
    api/
      users.js        # POST /users, POST /users/login, GET/PUT /user
      profiles.js     # GET /profiles/:username, follow/unfollow
      articles.js     # CRUD /articles, feed, favourites
      comments.js     # GET/POST/DELETE /articles/:slug/comments
      tags.js         # GET /tags
```

## How to run

```bash
npm install
# requires a running MongoDB instance
MONGODB_URI=mongodb://localhost/conduit npm start
# server starts on port 3000
```

## How to run tests

```bash
npm test
```

Tests use Mocha + Chai. They hit a real MongoDB test database — do not mock the DB layer.

## Key patterns

- **Auth middleware**: `routes/auth.js` exports `required` and `optional` middleware that decode JWT from the `Authorization: Token <jwt>` header. Most routes use `auth.required`.
- **Error handling**: Validation errors are returned as `{ errors: { field: [messages] } }` with status 422. Use this shape for any new validation.
- **Slug generation**: Articles use a URL slug derived from the title via the `slug` npm package. Slugs must be unique — check `Article.findOne({ slug })` before creating.
- **Mongoose virtuals**: `User` has a `toProfileJSONFor(user)` method that returns the profile shape including whether the requesting user follows this user.

## Common entry points for tickets

- Adding a new field to articles → `models/Article.js` + `routes/api/articles.js`
- Auth changes → `routes/auth.js` + `models/User.js`
- New endpoints → add a new file under `routes/api/` and register it in `app.js`
- Performance issues with feed → `routes/api/articles.js` `getFeed` handler, look at the Mongoose populate calls

## Things to watch out for

- MongoDB population chains can produce N+1 queries — use `.populate()` carefully and prefer aggregation for feed queries
- JWT secret is read from `process.env.SECRET` — never hardcode it
- All dates are stored as ISO strings, not Date objects
