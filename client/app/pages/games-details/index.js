/* eslint camelcase: 0, react/no-danger: 0 */

import { get, map } from 'lodash'
import React, { PropTypes } from 'react'
import Link from 'react-router/Link'

import styles from './styles.css'
import Fetch from '../../common/fetch'
import handleFetchResponse from '../../common/fetch/handle-response'

export default function GamesDetailsPage({ params }) {
  return (
    <Fetch url={`/api/v1/videogames/${params.gameId}`}>
      {handleFetchResponse(
        (game) => <GameDetails game={game} />,
        (error) => <GameError error={error} />
      )}
    </Fetch>
  )
}

GamesDetailsPage.propTypes = {
  params: PropTypes.shape({
    gameId: PropTypes.string.isRequired,
  }).isRequired,
}


function GameError({ error }) {
  if (error.response.status === 404) {
    return <div>{'Game Not Found'}</div>
  }
  return (
    <div>
      <div>{'An error occurred'}</div>
      <div>{error.message}</div>
    </div>
  )
}

GameError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    response: PropTypes.shape({
      status: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
}


function GameDetails({ game }) {
  const movieUrl = get(game, 'movies[0].webm.480')
  const movieThumb = get(game, 'movies[0].thumbnail')
  const cents = get(game, 'price_overview.initial')
  const price = cents ? `$${Math.floor(cents / 100)}.${cents % 100}` : 'FREE'
  return (
    <div className={styles.container} style={{ backgroundImage: `url(${game.background})` }}>
      <div className={styles.tinter} />
      <div className={styles.game}>
        <div className={styles.header}>
          <h1>{game.name}</h1>
          {movieUrl && <video src={movieUrl} poster={movieThumb} controls />}
          <button className={styles.buyNow}>{`Buy now for ${price}`}</button>
        </div>
        <h2>{'Description'}</h2>
        <div dangerouslySetInnerHTML={{ __html: game.about_the_game }} />
        <h2>{'Screenshots'}</h2>
        <div className={styles.screenshots}>
          {map(game.screenshots, ({ id, path_full, path_thumbnail }) => (
            <a key={id} href={path_full} target="_blank" rel="noopener noreferrer">
              <img src={path_thumbnail} />
            </a>
          ))}
        </div>
        <div className={styles.footer}>
          <div>
            {game.reviews && (
              <div>
                <h2>{'Reviews'}</h2>
                <div dangerouslySetInnerHTML={{ __html: game.reviews }} />
              </div>
            )}
            {(game.categories && !!game.categories.length) && (
              <div>
                <h2>{'Categories'}</h2>
                {map(game.categories, ({ id, description }) => (
                  <div key={id} className={styles.pill}>{description}</div>
                ))}
              </div>
            )}
            {(game.genres && !!game.genres.length) && (
              <div>
                <h2>{'Genres'}</h2>
                {map(game.genres, ({ id, description }) => (
                  <div key={id} className={styles.pill}>{description}</div>
                ))}
              </div>
            )}
            {(game.developers && !!game.developers.length) && (
              <div>
                <h2>{'Developed by'}</h2>
                {game.developers.join(', ')}
              </div>
            )}
            {(game.publishers && !!game.publishers.length) && (
              <div>
                <h2>{'Published by'}</h2>
                {game.publishers.join(', ')}
              </div>
            )}
            <div className={styles.legal}>{game.legal_notice}</div>
            <a
              href={`http://store.steampowered.com/app/${game.steam_appid}/`}
              target="_blank"
              rel="noopener noreferrer"
              children="See it on Steam"
            />
          </div>
          <div>
            <h2>{'User Reviews'}</h2>
            <Fetch url={`/api/v1/comments/?limit=20&videogameId=${game._id}`}>
              {handleFetchResponse((comments) => (
                <ul className={styles.comments}>
                  {map(comments, (comment) => (
                    <Fetch key={comment._id} url={`/api/v1/users/${comment.userId}`}>
                      {handleFetchResponse((user) => (
                        <li className={styles.comment}>
                          <Fetch url={`/api/v1/purchases/?userId=${user._id}&videogameId=${game._id}`}>
                            {handleFetchResponse((purchases) => (
                              <div>
                                <span>{`${comment.rating} / 10 stars - `}</span>
                                <Link to={`/users/${user._id}`}>{user.name}</Link>
                                {!!purchases.length && (
                                  <span className={styles.purchased}>{'Verified Purchase'}</span>
                                )}
                              </div>
                            ))}
                          </Fetch>
                          <h3>{comment.title}</h3>
                          <div>{comment.body}</div>
                        </li>
                      ))}
                    </Fetch>
                  ))}
                </ul>
              ))}
            </Fetch>
          </div>
        </div>
      </div>
    </div>
  )
}

GameDetails.propTypes = {
  game: PropTypes.shape({
    about_the_game: PropTypes.string.isRequired,
    background: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
    })),
    developers: PropTypes.arrayOf(PropTypes.string),
    genres: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })),
    legal_notice: PropTypes.string,
    movies: PropTypes.arrayOf(PropTypes.shape({
      thumbnail: PropTypes.string.isRequired,
      webm: PropTypes.shape({
        480: PropTypes.string.isRequired,
      }).isRequired,
    })),
    name: PropTypes.string.isRequired,
    price_overview: PropTypes.shape({
      initial: PropTypes.number.isRequired,
    }),
    publishers: PropTypes.arrayOf(PropTypes.string),
    reviews: PropTypes.string,
    screenshots: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      path_full: PropTypes.string.isRequired,
      path_thumbnail: PropTypes.string.isRequired,
    })).isRequired,
    steam_appid: PropTypes.number.isRequired,
  }).isRequired,
}

