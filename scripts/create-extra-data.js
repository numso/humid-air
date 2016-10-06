/* eslint no-console: 0, import/no-extraneous-dependencies: 0, no-loops/no-loops: 0 */

import Promise from 'bluebird'
import faker from 'faker'
import { flatten, includes, map, random, range, sampleSize } from 'lodash'
import { MongoClient } from 'mongodb'

const MONGO_URL = 'mongodb://localhost/humid-air'

const cleanIds = (rawIds) => map(rawIds, (id) => id.toString())

function generateUsers(numUsers) {
  return map(range(numUsers), generateUser)
}

function generateUser() {
  const initial = faker.helpers.contextualCard()
  const lastName = faker.name.lastName()
  return {
    name: `${initial.name} ${lastName}`,
    firstName: initial.name,
    lastName,
    dob: initial.dob,
    avatar: initial.avatar,
    username: initial.username,
    email: initial.email,
    role: 'user',
    phone: initial.phone,
  }
}

async function generateComments(db, userIds, min, max) {
  const comments = await Promise.all(map(userIds, async (userId) => {
    const numComments = random(min, max)
    const rawVideogames = await db.collection('videogames').aggregate([
      { $sample: { size: numComments } },
      { $project: { _id: 1 } },
    ]).toArray()
    const rawVideogameIds = map(rawVideogames, '_id')
    const videogameIds = cleanIds(rawVideogameIds)
    return map(videogameIds, (videogameId) => ({
      userId,
      videogameId,
      rating: random(1, 10),
      body: faker.lorem.paragraph(),
      title: faker.lorem.sentence(),
    }))
  }))
  return flatten(comments)
}

async function generatePurchases(db, userIds, min, max) {
  const purchases = await Promise.all(map(userIds, async (userId) => {
    const numPurchases = random(min, max)
    const rawVideogames = await db.collection('videogames').aggregate([
      { $sample: { size: numPurchases } },
      { $project: { _id: 1 } },
    ]).toArray()
    const rawVideogameIds = map(rawVideogames, '_id')
    const videogameIds = cleanIds(rawVideogameIds)
    return map(videogameIds, (videogameId) => ({
      userId,
      videogameId,
    }))
  }))
  return flatten(purchases)
}

function generateFriendships(userIds, numFriendships) {
  let friendships
  for (friendships = []; friendships.length < numFriendships;) {
    const friendship = sampleSize(userIds, 2).sort().join('-')
    if (!includes(friendships, friendship)) friendships.push(friendship)
  }
  return map(friendships, (friendship) => ({
    userIds: friendship.split('-'),
  }))
}

async function putToMongo(db, table, docs) {
  let result
  try {
    result = await db.collection(table).insertMany(docs)
    console.log(`inserted ${result.insertedCount} documents`)
  } catch (e) {
    console.error(e)
    process.exit(2)
  }
  return result.insertedIds
}

async function mongoify(fn) {
  try {
    const db = await MongoClient.connect(MONGO_URL)
    await fn(db)
    db.close()
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
}

async function driver(db) {
  const users = generateUsers(100)
  console.log('saving users')
  const rawUserIds = await putToMongo(db, 'users', users)
  const userIds = cleanIds(rawUserIds)
  const comments = await generateComments(db, userIds, 4, 8)
  const purchases = await generatePurchases(db, userIds, 1, 5)
  const friendships = generateFriendships(userIds, 450)
  console.log('saving comments')
  await putToMongo(db, 'comments', comments)
  console.log('saving purchases')
  await putToMongo(db, 'purchases', purchases)
  console.log('saving friendships')
  await putToMongo(db, 'friendships', friendships)
}

mongoify(driver)
  .then(() => console.log('Success!!'))
  .catch(console.error.bind(console))
