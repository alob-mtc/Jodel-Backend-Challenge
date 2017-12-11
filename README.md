# Backend Code Challenge

Welcome!

This is a simple book store api. It exposes 2 endpoints

* GET /v1/books: to retrieve a piginated list of books. Books can also by
  filtered by their title, author, genre or a combination of any of the 3 fields
  eg /v1/books?title=mytitle&author=jodel
* POST /v1/books: creates a new book provided the payload is valid

You can go to the docs at http://localhost:3000/docs (after you run the app) for
more information

## Running the app

### Without docker-compose

* Start mongodb server on your local machine via brew (brew services start
  mongo)
* Start redis server on your local machine via brew (brew services start redis)
* Ensure you have node 8+ installed on your local machine
* Run `npm install` or `yarn`
* Start app via `npm start` or `yarn start`
* Visit localhost:3000

### Running Tests

* Run `yarn test` or `npm test`

## Running app with docker-compose

* Use `docker-compose up web` or just run `make run`(if you have make installed)

### Running test with docker-compose

* Use `docker-compose run web yarn test` or `make` or `make test`

## Seeding the db

The app comes with a book generation seed script.

* Run `make seed` to create 5 books in the db.
* Run `docker-compose run web yarn seed x` to create x number of books

## Caching

Redis is used to implement caching of `GET /v1/books`. The caching functionality
was added as a middleware. You can find the middleware
[here](/start/middlewares/redisCache.js)

## Folder structure

├── Dockerfile
├── Makefile
├── README.md
├── config
│ └── index.js
├── controllers
│ ├── BookController.js
│ └── BookController.spec.js
├── db
│ ├── factories
│ │ └── Book.js
│ └── seeds
│ └── index.js
├── docker-compose.override.yml
├── docker-compose.prod.yml
├── docker-compose.yml
├── file.logger
├── lib
│ ├── loadModels.js
│ └── toSwaggerDoc.js
├── models
│ └── Book.js
├── package.json
├── server.js
├── setupTests.js
├── start
│ ├── app.js
│ ├── docs
│ │ ├── books.js
│ │ ├── index.js
│ │ └── utils.js
│ ├── middlewares
│ │ ├── index.js
│ │ ├── logger.js
│ │ ├── redisCache.js
│ │ ├── requestId.js
│ │ ├── responseTime.js
│ │ └── validation.js
│ └── routes.js
└── yarn.lock
