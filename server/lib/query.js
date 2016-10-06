/* eslint lodash/prefer-lodash-method: 0 */

import Promise from 'bluebird'
import { each, get, includes, isEmpty, map, omit, reduce, startsWith } from 'lodash'

export default async function apiQuery(Model, opts, query) {
  const countCursor = buildCursor(Model, opts, query)
  let resCursor = buildCursor(Model, opts, query)
  resCursor = paging(resCursor, opts, query)
  const [count, res] = await Promise.all([
    countCursor.count().exec(),
    resCursor.exec(),
  ])
  const fields = getFields(query)
  const stripId = fields && !includes(fields, '_id')
  return {
    count,
    items: map(res, (_item) => {
      const item = _item.toJSON()
      item._id = item._id.toString()
      if (stripId) delete item._id
      return item
    }),
  }
}

function buildCursor(Model, opts, query) {
  const _query = {}
  let _projection
  // full text search
  if (query.q && get(opts, 'fields.length')) {
    const searchStr = query.q.replace(/[#-.]|[[-^]|[?|{}]/g, '\\$&')
    query.$or = map(opts.fields, (field) => ({
      [field]: new RegExp(`.*${searchStr}.*`, 'i'),
    }))
  }
  // attribute search
  const searchFields = omit(query, ['sort', 'limit', 'skip', 'q', 'fields'])
  if (!isEmpty(searchFields)) {
    each(searchFields, (val, key) => {
      _query[key] = val
    })
  }
  // field filtering
  const fields = getFields(query)
  if (fields) {
    _projection = reduce(fields, (memo, field) => ({ ...memo, [field]: 1 }), {})
  }
  let cursor = Model.find(_query, _projection)
  // sorting
  if (query.sort) {
    const sorts = reduce(query.sort.split(','), (memo, field) => {
      const dir = startsWith(field, '-') ? -1 : 1
      const attr = startsWith(field, '-') ? field.substr(1) : field
      return { ...memo, [attr]: dir }
    }, {})
    cursor = cursor.sort(sorts)
  }
  return cursor
}

function paging(cursor, opts, query) {
  let limit = 'limit' in query ? +query.limit : (opts.defaultLimit || 100)
  let skip = 'skip' in query ? +query.skip : 0
  if (isNaN(skip) || skip < 0) {
    skip = 0
  }
  if (isNaN(limit) || limit < 0) {
    limit = opts.defaultLimit || 100
  }
  limit = Math.min(limit, opts.maxLimit || 1000)
  return cursor.skip(skip).limit(limit)
}

function getFields(query) {
  return query.fields
    ? query.fields.split(',')
    : null
}
