import Model from './model'
import * as crud from '../../lib/crud'

const opts = {
  defaultLimit: 10,
  maxLimit: 30,
}

export default function (app) {
  app.get('/purchases', getAll)
  app.get('/purchases/:id', get)
}

async function getAll(req, res, next) {
  try {
    const { count, items } = await crud.query(Model, opts, req.query)
    res.setHeader('item-count', count)
    res.json(items)
  } catch (e) {
    next(e)
  }
}

async function get(req, res, next) {
  try {
    const item = await crud.load(Model, req.params.id)
    if (item) res.json(item)
    else res.sendStatus(404)
  } catch (e) {
    next(e)
  }
}
