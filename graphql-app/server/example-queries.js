// games list
{
  games {
    _id
    name
    header_image
  }
}

// users list
{
  users {
    _id
    name
  }
}

// game details
{
  game(id: "57f5358c70c057f747dc21f2") {
    name
    movies {
      thumbnail
      webm {
        _480
      }
    }
    price_overview {
      initial
    }
    about_the_game
    screenshots {
      id
      path_full
      path_thumbnail
    }
    reviews
    categories {
      id
      description
    }
    genres {
      id
      description
    }
    developers
    publishers
    steam_appid

    userReviews {
      rating
      title
      body
      user {
        _id
        name
      }
    }
  }
}


// users details
{
  user(id: "57f67a1f49f0063d713f2581") {
    avatar
    firstName
    lastName
    username
    email
    phone
    dob
    purchases {
      videogame {
        _id
        header_image
        name
      }
    }
    reviews {
      rating
      title
      body
      videogame {
        _id
        name
      }
    }
    friendships {
      friend {
        _id
        name
      }
    }
  }
}
