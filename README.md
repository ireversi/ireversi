# iReversi

[![CircleCI (develop branch)](https://circleci.com/gh/ireversi/ireversi/tree/develop.svg?style=shield)](https://circleci.com/gh/ireversi/ireversi)
[![Tested with Jest](https://img.shields.io/badge/tested_with-Jest-99424f.svg)](https://github.com/facebook/jest)
[![Coveralls github](https://img.shields.io/codecov/c/github/ireversi/ireversi/develop.svg)](https://codecov.io/gh/ireversi/ireversi)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Play

**[iReversi](https://ireversi.io/)**

## Develop

```bash
# Install dependencies
$ npm install # Or yarn

# Serve with hot reload at localhost:3000
$ npm run dev # Or yarn dev

# Testing JavaScript
$ npm test # Or yarn test
```

### Environment Variables

> Create a `.env` file in the root directory of your project. ([dotenv](https://github.com/motdotla/dotenv#readme))

```sh
# Set `baseURL` for axios
AXIOS_BASE # Required

# Test ignore patterns
# Default:  []
JEST_IGNORE

# MongoDB URI
# Default: mongodb://localhost:27017/ireversi
MONGO_URI

# API server port
# Default: 10000
PORT
```

### API documents (Staging)

Use Swagger

[v1](https://ireversi-server.now.sh/api-docs/v1/) /
[v2](https://ireversi-server.now.sh/api-docs/v2/)
