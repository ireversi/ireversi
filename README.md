# iReversi

[![CircleCI (develop branch)](https://circleci.com/gh/ireversi/ireversi/tree/develop.svg?style=shield)](https://circleci.com/gh/ireversi/ireversi)
[![node](https://img.shields.io/badge/node->%3D10.13.0-brightgreen.svg)](https://nodejs.org/dist/latest-v10.x/docs/api/)
[![Tested with Jest](https://img.shields.io/badge/tested_with-Jest-99424f.svg)](https://github.com/facebook/jest)
[![Coveralls github](https://img.shields.io/codecov/c/github/ireversi/ireversi/master.svg)](https://codecov.io/gh/ireversi/ireversi)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Play

**[iReversi](https://ireversi.io/)**

## Develop

```bash
# Install dependencies
$ npm install # Or yarn

# Develop iReversi
$ npm run dev # Or yarn dev

# Client origin
#   http://localhost:3000
# API server origin
#   http://localhost:10000

# Test JavaScript files
$ npm test # Or yarn test
```

### Database

iReversi depends on [MongoDB](https://docs.mongodb.com/).

- Download  
  [MongoDB Download Center](https://www.mongodb.com/download-center/community)
- Cloud  
  [MongoDB Cloud Database Solutions](https://www.mongodb.com/cloud)

### Environment Variables

```sh
# Set `baseURL` for axios
# Default: http://localhost:10000/api
AXIOS_BASE

# Test ignore patterns
# Default: []
JEST_IGNORE

# MongoDB URI
# Default: mongodb://localhost:27017/ireversi
MONGO_URI

# API server port
# Default: 10000
PORT
```

Example of a `.env` file. (Using [dotenv](https://github.com/motdotla/dotenv#readme))

```sh
# .env
AXIOS_BASE=http://localhost:3025/api
JEST_IGNORE=<rootDir>.*fileOrDirectoryName
MONGO_URI=mongodb://your.mongodb.server:27017/ireversi
PORT=3025
```

### API documents

[Document for iReversi API v1](https://server.ireversi.io/api-docs/v1/). (Using [Swagger](https://swagger.io/docs/))
