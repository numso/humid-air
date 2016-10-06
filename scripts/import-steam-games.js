/* eslint no-console: 0, import/no-extraneous-dependencies: 0 */

import axios from 'axios'
import fs from 'fs'
import { includes, map } from 'lodash'
import { MongoClient } from 'mongodb'

import ids from './ids'

const MONGO_URL = 'mongodb://localhost/humid-air'
const SHOULD_FETCH = includes(process.argv, '--fetch')
const SHOULD_WRITE = includes(process.argv, '--write')

async function fetchGame(id) {
  let resp
  try {
    resp = await axios.get(`http://store.steampowered.com/api/appdetails?appids=${id}`)
    if (!resp.data[id].success) console.log(id, resp)
    resp = resp.data[id].data
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  return resp
}

async function putToMongo(games) {
  try {
    const db = await MongoClient.connect(MONGO_URL)
    const result = await db.collection('videogames').insertMany(games)
    console.log(`inserted ${result.insertedCount} documents`)
    db.close()
  } catch (e) {
    console.error(e)
    process.exit(2)
  }
}

async function driver() {
  let games = []
  if (SHOULD_FETCH) {
    games = await Promise.all(map(ids, fetchGame))
    console.log(`fetched ${games.length} games`)
    fs.writeFileSync(`${__dirname}/games.json`, JSON.stringify(games, null, 2))
  } else {
    games = fs.readFileSync(`${__dirname}/games.json`)
    games = JSON.parse(games)
    console.log(`read ${games.length} games from cache`)
  }
  if (SHOULD_WRITE) {
    await putToMongo(games)
  }
}

driver()
  .then(() => console.log('Success!!'))
  .catch(console.error.bind(console))
