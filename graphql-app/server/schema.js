import axios from 'axios'
import Promise from 'bluebird'
import DataLoader from 'dataloader'
import {
  GraphQLSchema,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'
import { map, without } from 'lodash'

// const HOST = 'http://localhost:8484'
const HOST = 'https://humid-air.now.sh'


const gameLoader = new DataLoader((ids) => (
  Promise.all(map(ids, fetch('videogames')))
))

const userLoader = new DataLoader((ids) => (
  Promise.all(map(ids, fetch('users')))
))

function fetch(resource) {
  return (id) => axios.get(`${HOST}/api/v1/${resource}/${id}`)
    .then((resp) => resp.data)
}

function fetchAll(resource) {
  return ({ limit = 10, skip = 0 }) => (
    axios.get(`${HOST}/api/v1/${resource}/?limit=${limit}&skip=${skip}`)
      .then((resp) => resp.data)
  )
}

function fetchPurchaseFor(id) {
  return axios.get(`${HOST}/api/v1/purchases/?userId=${id}`)
    .then((resp) => resp.data)
}

async function fetchFriendshipsFor(selfId) {
  const { data } = await axios.get(`${HOST}/api/v1/friendships/?userIds=${selfId}`)
  return map(data, ({ _id, userIds }) => ({
    _id, selfId, friendId: without(userIds, selfId)[0],
  }))
}

function fetchReviewsForUser(id) {
  return axios.get(`${HOST}/api/v1/comments/?userId=${id}`)
    .then((resp) => resp.data)
}

function fetchReviewsForGame(id) {
  return axios.get(`${HOST}/api/v1/comments/?videogameId=${id}`)
    .then((resp) => resp.data)
}


// -------------------------------------------------------------------------------------- Game


const gameType = new GraphQLObjectType({
  name: 'GameType',
  fields: () => ({
    _id: {
      description: 'The id of the game',
      type: new GraphQLNonNull(GraphQLString),
    },
    about_the_game: {
      description: 'The name of the game',
      type: GraphQLString,
    },
    background: {
      description: 'The background image for the game',
      type: GraphQLString,
    },
    categories: {
      description: 'The categories this game belongs to',
      type: new GraphQLList(new GraphQLObjectType({
        name: 'GameCategoryType',
        fields: {
          id: {
            description: 'The id of the category',
            type: GraphQLInt,
          },
          description: {
            description: 'The name of the category',
            type: GraphQLString,
          },
        },
      })),
    },
    developers: {
      description: 'The developers of the game',
      type: new GraphQLList(GraphQLString),
    },
    genres: {
      description: 'The genres this game belongs to',
      type: new GraphQLList(new GraphQLObjectType({
        name: 'GameGenreType',
        fields: {
          id: {
            description: 'The id of the genre',
            type: GraphQLString,
          },
          description: {
            description: 'The name of the genre',
            type: GraphQLString,
          },
        },
      })),
    },
    header_image: {
      description: 'The header image of the game',
      type: GraphQLString,
    },
    legal_notice: {
      description: 'The name of the game',
      type: GraphQLString,
    },
    movies: {
      description: 'Movies of the game',
      type: new GraphQLList(new GraphQLObjectType({
        name: 'GameMovieType',
        fields: {
          thumbnail: {
            description: 'The thumbnail for the movie',
            type: GraphQLString,
          },
          webm: {
            description: 'The webm movie info for the game',
            type: new GraphQLObjectType({
              name: 'GameMovieWebmType',
              fields: {
                _480: {
                  description: 'The url for the 480p movie',
                  type: GraphQLString,
                  resolve: (webm) => webm[480],
                },
                max: {
                  description: 'The url for the movie',
                  type: GraphQLString,
                },
              },
            }),
          },
        },
      })),
    },
    name: {
      description: 'The name of the game',
      type: GraphQLString,
    },
    price_overview: {
      description: 'The price of the game',
      type: new GraphQLObjectType({
        name: 'GamePriceType',
        fields: {
          currency: {
            description: 'The currency of the price',
            type: GraphQLString,
          },
          discount_percent: {
            description: 'The discount percent if any',
            type: GraphQLInt,
          },
          final: {
            description: 'The price after discount',
            type: GraphQLInt,
          },
          initial: {
            description: 'The starting price',
            type: GraphQLInt,
          },
        },
      }),
    },
    publishers: {
      description: 'The developers of the game',
      type: new GraphQLList(GraphQLString),
    },
    reviews: {
      description: 'The reviews for the game',
      type: GraphQLString,
    },
    screenshots: {
      description: 'The screenshots for the game',
      type: new GraphQLList(new GraphQLObjectType({
        name: 'GameScreenshotType',
        fields: {
          id: {
            description: 'The id of the screenshot',
            type: GraphQLInt,
          },
          path_full: {
            description: 'The url for the screenshot',
            type: GraphQLString,
          },
          path_thumbnail: {
            description: 'The url for the thumbnail',
            type: GraphQLString,
          },
        },
      })),
    },
    steam_appid: {
      description: 'The steam appid of the game',
      type: GraphQLInt,
    },

    userReviews: {
      description: 'User reviews of this game',
      type: new GraphQLList(reviewType),
      resolve: (game) => fetchReviewsForGame(game._id),
    },
  }),
})


// -------------------------------------------------------------------------------------- Purchase


const purchaseType = new GraphQLObjectType({
  name: 'PurchaseType',
  fields: () => ({
    _id: {
      description: 'The _id of the review',
      type: GraphQLString,
    },
    videogameId: {
      description: 'The videogameId of the review',
      type: GraphQLString,
    },
    userId: {
      description: 'The userId of the review',
      type: GraphQLString,
    },

    videogame: {
      description: 'The videogame for which the review is about',
      type: gameType,
      resolve: (review) => gameLoader.load(review.videogameId),
    },
    user: {
      type: userType,
      resolve: (review) => userLoader.load(review.userId),
    },
  }),
})


// -------------------------------------------------------------------------------------- Friendship


const friendshipType = new GraphQLObjectType({
  name: 'FriendshipType',
  fields: () => ({
    _id: {
      description: 'The _id of the friendship',
      type: GraphQLString,
    },
    selfId: {
      description: 'The id of friend1',
      type: GraphQLString,
    },
    friendId: {
      description: 'The id of friend2',
      type: GraphQLString,
    },

    self: {
      description: 'friend1',
      type: userType,
      resolve: (friendship) => userLoader.load(friendship.selfId),
    },
    friend: {
      description: 'friend2',
      type: userType,
      resolve: (friendship) => userLoader.load(friendship.friendId),
    },
  }),
})


// -------------------------------------------------------------------------------------- Review


const reviewType = new GraphQLObjectType({
  name: 'ReviewType',
  fields: () => ({
    _id: {
      description: 'The _id of the review',
      type: GraphQLString,
    },
    title: {
      description: 'The title of the review',
      type: GraphQLString,
    },
    body: {
      description: 'The body of the review',
      type: GraphQLString,
    },
    rating: {
      description: 'The rating of the review',
      type: GraphQLString,
    },
    videogameId: {
      description: 'The videogameId of the review',
      type: GraphQLString,
    },
    userId: {
      description: 'The userId of the review',
      type: GraphQLString,
    },

    videogame: {
      description: 'The videogame for which the review is about',
      type: gameType,
      resolve: (review) => gameLoader.load(review.videogameId),
    },
    user: {
      type: userType,
      resolve: (review) => userLoader.load(review.userId),
    },
  }),
})


// -------------------------------------------------------------------------------------- User


const userType = new GraphQLObjectType({
  name: 'UserType',
  fields: () => ({
    _id: {
      description: 'The id of the user',
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      description: 'The name of the user',
      type: GraphQLString,
      resolve: (user) => `${user.firstName} ${user.lastName}`,
    },
    firstName: {
      description: 'The first name of the user',
      type: GraphQLString,
    },
    lastName: {
      description: 'The last name of the user',
      type: GraphQLString,
    },
    dob: {
      description: 'The date of birth of the user',
      type: GraphQLString,
    },
    avatar: {
      description: 'The avatar of the user',
      type: GraphQLString,
    },
    username: {
      description: 'The username of the user',
      type: GraphQLString,
    },
    email: {
      description: 'The email of the user',
      type: GraphQLString,
    },
    role: {
      description: 'The role of the user',
      type: GraphQLString,
    },
    phone: {
      description: 'The phone of the user',
      type: GraphQLString,
    },

    purchases: {
      description: 'The list of purchases this user has made',
      type: new GraphQLList(purchaseType),
      resolve: (user) => fetchPurchaseFor(user._id),
    },
    friendships: {
      description: 'A list of the user\'s friends',
      type: new GraphQLList(friendshipType),
      resolve: (user) => fetchFriendshipsFor(user._id),
    },
    reviews: {
      description: 'A list of the user\'s reviews',
      type: new GraphQLList(reviewType),
      resolve: (user) => fetchReviewsForUser(user._id),
    },
  }),
})


// -------------------------------------------------------------------------------------- Schema


const schema = new GraphQLSchema({

  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      games: {
        description: 'A paginated list of all games',
        type: new GraphQLList(gameType),
        args: {
          limit: {
            description: 'How many games to pull back',
            type: GraphQLInt,
          },
          skip: {
            description: 'How many games to skip',
            type: GraphQLInt,
          },
        },
        resolve: (_, args) => fetchAll('videogames')(args),
      },
      game: {
        description: 'A game fetched by id',
        type: gameType,
        args: {
          id: {
            description: 'The ID of the game you are fetching',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: (_, args) => gameLoader.load(args.id),
      },
      users: {
        description: 'A paginated list of all users',
        type: new GraphQLList(userType),
        args: {
          limit: {
            description: 'How many users to pull back',
            type: GraphQLInt,
          },
          skip: {
            description: 'How many users to skip',
            type: GraphQLInt,
          },
        },
        resolve: (_, args) => fetchAll('users')(args),
      },
      user: {
        description: 'A user fetched by id',
        type: userType,
        args: {
          id: {
            description: 'The ID of the user you are fetching',
            type: new GraphQLNonNull(GraphQLString),
          },
        },
        resolve: (_, args) => userLoader.load(args.id),
      },
    },
  }),
})

export default schema
