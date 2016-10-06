/* eslint react/display-name: 0 */

import React from 'react'

import LoadingSpinner from '../loading-spinner'

export default function handleFetchResponse(render, errorFn) {
  return (loading, error, data) => {
    if (loading) return <LoadingSpinner />
    if (error) return errorFn ? errorFn(error) : 'An error occurred'
    return render(data)
  }
}
