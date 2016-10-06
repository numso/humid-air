# Humid Air Games
This is an example of how to progressively add graphql to an existing code base.

The master branch is a REST app. It deals with videogames, users, friendships, comments. and purchases and the various relationships these entities have. The goal of this project is to show how we can wrap an existing app with GraphQL. We'll be creating a separate app that uses GraphQL to hit this app's APIs. You can see the finished result in the graphql branch.

### For Development
- start mongo
- npm run watch
- npm start

### To load the data
- npm run db:loadgames
- npm run db:loadother

### For Production
- npm run build
- npm start
