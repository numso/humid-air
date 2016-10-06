import { map } from 'lodash'
import React, { Component, PropTypes } from 'react'
import Link from 'react-router/Link'

import styles from './style.css'
import Fetch from '../../common/fetch'
import LoadingSpinner from '../../common/loading-spinner'

const PAGE_SIZE = 20

export default function GamesListPage({ skip = 0 }) {
  return (
    <Fetch url={`/api/v1/videogames?skip=${skip}&limit=${PAGE_SIZE}`}>
      {(loading, error, games, resp) => (
        loading
          ? <LoadingSpinner />
          : error
            ? <GamesError />
            : <GamesList games={games} skip={skip} itemCount={resp.headers['item-count']} />
      )}
    </Fetch>
  )
}

GamesListPage.propTypes = {
  skip: PropTypes.number,
}


function GamesError() {
  return <div>{'An error occurred while trying to fetch games. Please try again.'}</div>
}


class GamesList extends Component {

  static displayName = 'GamesList';

  static propTypes = {
    games: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      header_image: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    itemCount: PropTypes.string.isRequired,
    skip: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = { loadMore: false }
  }

  render() {
    const { games, skip, itemCount } = this.props
    const { loadMore } = this.state
    const moreExist = skip + PAGE_SIZE < +itemCount
    return (
      <div className={styles.container}>
        <ul className={styles.games}>
          {map(games, (game) => (
            <li className={styles.game} key={game._id}>
              <Link to={`/games/${game._id}`}>
                <img src={game.header_image} />
                <div className={styles.title}>{game.name}</div>
              </Link>
            </li>
          ))}
        </ul>
        {moreExist && !loadMore && (
          <button
            children="Load More"
            className={styles.loadMore}
            onClick={() => this.setState({ loadMore: true })}
          />
        )}
        {loadMore && <GamesListPage skip={skip + PAGE_SIZE} />}
      </div>
    )
  }
}
