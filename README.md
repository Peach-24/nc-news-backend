# Northcoders News API

## Brief

During this backend project, I built an API for the purpose of accessing application data programmatically. 

The database uses PSQL, and queries to the database make use of [Knex](https://knexjs.org).

The data was provided as part of a Northcoders sprint. 

___

## Testing

I built this API using test-driven development to check both the response status codes, and response body formatting.

I also have a test file for utility functions that formatted data used in seeding.

For error-handling, see `/controllers/error-controllers.js`.


___

### Database Schema

I have separate tables for `topics`, `articles`, `users` and `comments`. There are different constraints on table columns (e.g. 'NOT NULL').

### Methods and endpoints

```http
GET /api/topics
GET /api/users/:username

DELETE /api/articles/:article_id
PATCH /api/articles/:article_id
GET /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/:article_id/comments

GET /api/articles
POST /api/articles

PATCH /api/comments/:comment_id
DELETE /api/comments/:comment_id

GET /api

DELETE /api/articles/:article_id
POST /api/topics
POST /api/users
GET /api/users

DELETE /api/articles/:article_id
POST /api/topics
POST /api/users
GET /api/users
```

---

### Responses

Responses are sent in an object, with a key name of what it is that being sent. E.g.**_

```json
{
  "topics": [
    {
      "description": "Code is love, code is life",
      "slug": "coding"
    },
    {
      "description": "FOOTIE!",
      "slug": "football"
    },
    {
      "description": "Hey good looking, what you got cooking?",
      "slug": "cooking"
    }
  ]
}
```
---

## Lessons learnt 

This week-long sprint helped me gain a stronger understanding of the MVC pattern, even though I was primarily focussing on models and controllers.

I also learnt how to make use of `Express` and `Axios` for making HTTP requests, and understood how `Knex` could help when it came to migrations, seeding the database, and having different ENVs - environments.

