const fs = require('fs')
const path = require('path')
// const ejs = require('ejs')
const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const MarkdownIt = require('markdown-it')
const webpackConfig = require('./webpack.config')
const app = express()
const md = new MarkdownIt()
const introduce = fs.readFileSync(path.join(__dirname, './introduce.md'), { encoding: 'utf-8' })
const result = md.render(introduce)

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname))
app.use(middleware(webpack(webpackConfig), {}))
app.use(express.static(__dirname))

app.get('/', function(req, res) {
  const data = {
    introduce: result
  }
  res.render('index', data)
})
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8080
app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}, Ctrl+C to stop`)
})
