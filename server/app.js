import config from 'config'
import express from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'

import commentsRoutes from './resources/comments/routes'
import friendshipsRoutes from './resources/friendships/routes'
import purchasesRoutes from './resources/purchases/routes'
import usersRoutes from './resources/users/routes'
import videogamesRoutes from './resources/videogames/routes'

mongoose.connect(config.db.uri, config.db.options)

const PORT = 8484
const app = express()

const router = new express.Router()
commentsRoutes(router)
friendshipsRoutes(router)
purchasesRoutes(router)
usersRoutes(router)
videogamesRoutes(router)

app.use(morgan('dev'))
app.use(express.static('client'))
app.use('/api/v1/', router)

app.listen(PORT, () => {
  console.log(`App listening on ${PORT}`) // eslint-disable-line no-console
})
