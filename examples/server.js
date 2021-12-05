const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const webpackConfig = require('./webpack.config')
const app = express()

app.use(middleware(webpack(webpackConfig), {}))
app.use(express.static(__dirname))

const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8080
app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}, Ctrl+C to stop`)
})
