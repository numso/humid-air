import { map } from 'lodash'
import React, { Component, PropTypes } from 'react'
import Link from 'react-router/Link'

import styles from './style.css'
import Fetch from '../../common/fetch'
import LoadingSpinner from '../../common/loading-spinner'

const PAGE_SIZE = 20

export default function UsersListPage({ skip = 0 }) {
  return (
    <Fetch url={`/api/v1/users?skip=${skip}&limit=${PAGE_SIZE}`}>
      {(loading, error, users, resp) => (
        loading
          ? <LoadingSpinner />
          : error
            ? <UsersError />
            : <UsersList users={users} skip={skip} itemCount={resp.headers['item-count']} />
      )}
    </Fetch>
  )
}

UsersListPage.propTypes = {
  skip: PropTypes.number,
}


function UsersError() {
  return <div>{'An error occurred while trying to fetch users. Please try again.'}</div>
}


class UsersList extends Component {

  static displayName = 'UsersList';

  static propTypes = {
    itemCount: PropTypes.string.isRequired,
    skip: PropTypes.number.isRequired,
    users: PropTypes.arrayOf(PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
  };

  constructor(props) {
    super(props)
    this.state = { loadMore: false }
  }

  render() {
    const { users, skip, itemCount } = this.props
    const { loadMore } = this.state
    const moreExist = skip + PAGE_SIZE < +itemCount
    return (
      <div className={styles.container}>
        <ul className={styles.users}>
          {map(users, (user) => (
            <li className={styles.user} key={user._id}>
              <Link to={`/users/${user._id}`}>
                <div className={styles.title}>{user.name}</div>
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
        {loadMore && <UsersListPage skip={skip + PAGE_SIZE} />}
      </div>
    )
  }
}
