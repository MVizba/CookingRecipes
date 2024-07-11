## Setup

1. `npm install`
2. Create a PostgreSQL database.
3. Add credentials to `.env` file based on `.env.example`.

For this project to work, you will need to finish writing entities and endpoints.

## Running the server

In development mode:

```bash
# automatically restarts the server
npm run dev

# uses in-memory pg-mem database
npm run dev:mem
```

## Tests

```bash
# runs tests against an in-memory pg-mem database
npm test

# runs tests with the configured database
npm run test:db
```

In production mode:

```bash
# prepare a migration
npm run migration:generate my_migration_name

# run a migration
npm run migration:run

# build
npm run build

# run the build
npm run start
```
