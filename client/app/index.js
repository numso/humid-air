import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import Router from 'react-router/HashRouter'

import './index.css'
import App from './app'

const el = document.getElementById('app')
ReactDOM.render(<Router><App /></Router>, el)
