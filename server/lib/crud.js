/* eslint lodash/prefer-lodash-method: 0, no-prototype-builtins: 0 */

import { each } from 'lodash'
import mongoose from 'mongoose'

const { isValid } = mongoose.Types.ObjectId

export async function save(Model, data) {
  if (!data.hasOwnProperty('_id')) {
    const model = new Model(data)
    const result = await model.save()
    return result && result.toJSON()
  }
  checkId(data._id)
  const results = await Model.find({ _id: data._id }).exec()
  checkExists(results)
  const entity = results[0]
  updateFields(entity, data)
  const res = await entity.save()
  return res && res.toJSON()
}

export async function load(Model, id, field = '_id') {
  checkId(id)
  const results = await Model.find({ [field]: id }).exec()
  checkExists(results)
  return results[0] && results[0].toJSON()
}

export query from './query'

export async function remove(Model, _id) {
  checkId(_id)
  const result = await Model.remove({ _id }).exec()
  return result && result.toJSON()
}

function updateFields(updatee, updator) {
  each(updator, (val, prop) => (updatee[prop] = val))
}

function checkId(_id) {
  if (!isValid(_id)) throw Error('Invalid ID')
}

function checkExists(results) {
  if (results.length === 0) throw new Error('Not Found')
}
