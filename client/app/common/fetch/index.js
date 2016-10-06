import axios from 'axios'
import { get } from 'lodash'
import { Component, PropTypes } from 'react'

export default class Fetch extends Component {

  static displayName = 'Fetch';

  static propTypes = {
    children: PropTypes.func.isRequired,
    url: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props)
    this.state = { loading: true, error: null, resp: null }
    this.fetchData(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ loading: true, error: null, resp: null })
    this.fetchData(nextProps)
  }

  async fetchData({ url }) {
    let resp
    try {
      resp = await axios.get(url)
    } catch (error) {
      this.setState({ loading: false, error })
      return
    }
    this.setState({ loading: false, resp })
  }

  render() {
    const { loading, error, resp } = this.state
    return this.props.children(loading, error, get(resp, 'data'), resp)
  }

}
