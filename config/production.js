/* eslint import/no-commonjs: 0 */

module.exports = {
  db: {
    uri: process.env.MONGO_URI,
    options: {
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    },
  },
}
