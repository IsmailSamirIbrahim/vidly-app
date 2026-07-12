# Vidly App

A RESTful API for an imaginary movie rental service, built with Node.js, Express, and MongoDB.

## Features

- Movie and genre management
- Customer management
- Rental tracking with return processing
- JWT-based authentication and authorization
- Input validation with Joi
- Structured logging with Winston (console + MongoDB transport)
- HTTP request logging with Morgan
- Security hardening with Helmet
- Automated tests with Jest and Supertest

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express |
| Database | MongoDB (via Mongoose) |
| Auth | JSON Web Tokens + bcrypt |
| Validation | Joi |
| Logging | Winston, Winston-MongoDB, Morgan |
| Security | Helmet |
| Testing | Jest, Supertest |

## Project Structure

```
vidly-app/
├── config/         # Environment-specific configuration
├── middleware/     # Custom Express middleware (auth, error handling, etc.)
├── models/         # Mongoose schemas and models
├── routes/         # Express route handlers
├── startup/        # App initialization (db, logging, routes, config)
├── tests/          # Integration and unit tests
└── index.js        # Entry point
```

## Prerequisites

- Node.js v18+
- MongoDB instance (local or Atlas)

## Getting Started

1. **Clone the repo**

```bash
git clone https://github.com/IsmailSamirIbrahim/vidly-app.git
cd vidly-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment**

Create configuration files under `config/` for your environment. At minimum, set:

- `db` — MongoDB connection string
- `jwtPrivateKey` — secret key for signing JWTs

Example using the `config` package (`config/default.json`):

```json
{
  "db": "mongodb://localhost/vidly",
  "jwtPrivateKey": "your_secret_key"
}
```

4. **Run the server**

```bash
node index.js
```

Or with auto-reload via nodemon:

```bash
npx nodemon index.js
```

The API will be available at `http://localhost:3000` by default.

## API Endpoints

| Resource | Endpoint |
|---|---|
| Genres | `/api/genres` |
| Movies | `/api/movies` |
| Customers | `/api/customers` |
| Rentals | `/api/rentals` |
| Returns | `/api/returns` |
| Users | `/api/users` |
| Auth | `/api/auth` |

All write operations require a valid JWT passed in the `x-auth-token` header.

## Running Tests

```bash
npm test
```

Runs Jest in watch mode with verbose output and coverage reporting.

## License

ISC
