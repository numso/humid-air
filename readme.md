# Humid Air Games
This is an example of how to progressively add graphql to an existing code base. The goal of this project is to show how we can wrap an existing app with GraphQL.

The main project is a REST app. It deals with videogames, users, friendships, comments, and purchases and the various relationships these entities have. It is hosted at https://humid-air.now.sh/#/games.

The `graphql-app` folder contains a separate server running graphql. It has no database of its own. Instead, it just points to the REST app and provides a GraphQL interface. It is hosted at https://humid-air-gql.now.sh/graphql.

### Known issues
- The db:load scripts are hardcoded to point at localhost
- When hitting certain routes that should return 404, they instead return 500

### Prerequisites
You must have Mongo 3.2, Node 6.7, and npm 3.x installed

### To load the data
- make sure mongo is running
- npm run db:loadgames
- npm run db:loadother


### For Development
- start mongo
- npm run watch
- npm start

### For Production
- start mongo
- npm run build
- npm start
