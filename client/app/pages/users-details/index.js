/* eslint camelcase: 0, react/no-danger: 0, jsx-a11y/label-has-for: 0 */

import { map, without } from 'lodash'
import React, { PropTypes } from 'react'
import Link from 'react-router/Link'

import styles from './styles.css'
import Fetch from '../../common/fetch'
import handleFetchResponse from '../../common/fetch/handle-response'

export default function UsersDetailsPage({ params }) {
  return (
    <Fetch url={`/api/v1/users/${params.userId}`}>
      {handleFetchResponse(
        (user) => <UserDetails user={user} />,
        (error) => <UserError error={error} />
      )}
    </Fetch>
  )
}

UsersDetailsPage.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
}


function UserError({ error }) {
  if (error.response.status === 404) {
    return <div>{'User Not Found'}</div>
  }
  return (
    <div>
      <div>{'An error occurred'}</div>
      <div>{error.message}</div>
    </div>
  )
}

UserError.propTypes = {
  error: PropTypes.shape({
    message: PropTypes.string.isRequired,
    response: PropTypes.shape({
      status: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
}


function UserDetails({ user }) {
  const format = { year: 'numeric', month: 'long', day: 'numeric' }
  const birthday = new Date(user.dob).toLocaleString('en-US', format)
  return (
    <div className={styles.container}>
      <div className={styles.user}>
        <div className={styles.header}>
          <img src={user.avatar} />
          <h1 className={styles.name}>{`${user.name} (${user.username})`}</h1>
        </div>
        <div className={styles.footer}>
          <div>
            <h2>{'Info'}</h2>
            <div className={styles.field}>
              <label>{'First Name'}</label>
              <div>{user.firstName}</div>
            </div>
            <div className={styles.field}>
              <label>{'Last Name'}</label>
              <div>{user.lastName}</div>
            </div>
            <div className={styles.field}>
              <label>{'Email'}</label>
              <div>{user.email}</div>
            </div>
            <div className={styles.field}>
              <label>{'Phone Number'}</label>
              <div>{user.phone}</div>
            </div>
            <div className={styles.field}>
              <label>{'Date of Birth'}</label>
              <div>{birthday}</div>
            </div>
          </div>
          <div>
            <h2>{'Recent Purchases'}</h2>
            <Fetch url={`/api/v1/purchases/?limit=10&userId=${user._id}`}>
              {handleFetchResponse((purchases) => (
                <ul className={styles.games}>
                  {map(purchases, (purchase) => (
                    <Fetch key={purchase._id} url={`/api/v1/videogames/${purchase.videogameId}`}>
                      {handleFetchResponse((videogame) => (
                        <li className={styles.game}>
                          <Link to={`/games/${videogame._id}`}>
                            <img src={videogame.header_image} />
                            <div>{videogame.name}</div>
                          </Link>
                        </li>
                      ))}
                    </Fetch>
                  ))}
                </ul>
              ))}
            </Fetch>
          </div>
          <div>
            <h2>{'Recent Reviews'}</h2>
            <Fetch url={`/api/v1/comments/?limit=10&userId=${user._id}`}>
              {handleFetchResponse((comments) => (
                <ul className={styles.comments}>
                  {map(comments, (comment) => (
                    <Fetch key={comment._id} url={`/api/v1/videogames/${comment.videogameId}`}>
                      {handleFetchResponse((videogame) => (
                        <li className={styles.comment}>
                          <div>
                            <span>{`${comment.rating} / 10 stars - `}</span>
                            <Link to={`/games/${videogame._id}`}>{videogame.name}</Link>
                          </div>
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
          <div>
            <h2>{'Friends'}</h2>
            <Fetch url={`/api/v1/friendships/?limit=20&userIds=${user._id}`}>
              {handleFetchResponse((friendships) => (
                <ul className={styles.comments}>
                  {map(friendships, (friendship) => (
                    <Fetch key={friendship._id} url={`/api/v1/users/${without(friendship.userIds, user._id)[0]}`}>
                      {handleFetchResponse((friend) => (
                        <li className={styles.comment}>
                          <Link to={`/users/${friend._id}`}>{friend.name}</Link>
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

UserDetails.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    dob: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
  }).isRequired,
}

