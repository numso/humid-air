import React from 'react'
import Link from 'react-router/Link'
import Match from 'react-router/Match'
import Miss from 'react-router/Miss'

import styles from './app.css'
import GameDetails from './pages/games-details'
import GamesList from './pages/games-list'
import NotFound from './pages/not-found'
import UserDetails from './pages/users-details'
import UsersList from './pages/users-list'

export default function App() {
  return (
    <div>
      <TopBar />
      <Match exactly pattern="/games" component={GamesList} />
      <Match pattern="/games/:gameId" component={GameDetails} />
      <Match exactly pattern="/users" component={UsersList} />
      <Match pattern="/users/:userId" component={UserDetails} />
      <Miss component={NotFound} />
    </div>
  )
}


function TopBar() {
  return (
    <ul className={styles.container}>
      <li><Link to="/games">{'Games'}</Link></li>
      <li><Link to="/users">{'Users'}</Link></li>
    </ul>
  )
}
