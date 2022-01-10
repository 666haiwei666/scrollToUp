const fs = require('fs')
const path = require('path')
const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const MarkdownIt = require('markdown-it')
const webpackConfig = require('./webpack.config')
const app = express()
const md = new MarkdownIt()
const introduce = fs.readFileSync(path.join(__dirname, './introduce.md'), { encoding: 'utf-8' })
const result = md.render(introduce)
const fileData = {
  css: './__build__/app.css',
  js: './__build__/app.js'
}
const pages = ['fullpage_1', 'fullpage_2', 'fullpage_3', 'block_1', 'block_2', 'block_3']

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname))
app.use(middleware(webpack(webpackConfig), {}))
app.use(express.static(__dirname))

app.get('/index', function(req, res) {
  const data = {
    introduce: result
  }
  res.render('index', data)
})
pages.forEach(page => {
  app.get(`/${page}.html`, function (req, res) {
    res.render(page, fileData)
  })
})
const host = process.env.HOST || 'localhost'
const port = process.env.PORT || 8080
app.listen(port, host, () => {
  console.log(`Server listening on http://${host}:${port}, Ctrl+C to stop`)
})
