/* eslint no-console: 0 */

import express from 'express'
import graphqlHTTP from 'express-graphql'

import schema from './schema'

const app = express()

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true,
}))

app.listen(8585, () => console.log('App listening on 8585'))
