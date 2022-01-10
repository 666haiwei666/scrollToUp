const fs = require('fs')
const path = require('path')
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()
const homePages = 'index.ejs'
const examplePages = ['fullpage_1', 'fullpage_2', 'fullpage_3', 'block_1', 'block_2', 'block_3']
const targetFile = files => path.join(__dirname, '../examples', files)
const websiteFile = files => path.join(__dirname, '../website', files)
const distFile = files => path.join(__dirname, '../dist', files)
const introduce = fs.readFileSync(targetFile('./introduce.md'), { encoding: 'utf-8' })
const introduceReg = /<%-[\s]*introduce[\s]*%>/g
const cssReg = /<%=[\s]*css[\s]*%>/g
const jsReg = /<%=[\s]*js[\s]*%>/g

const copyFile = async (originPath, targetPath) => {
  const fileContent = await fs.promises.readFile(originPath)
  await fs.promises.writeFile(targetPath, fileContent, { encoding: 'utf-8', flag: 'w' })
}
const clearDir = () => {
  return fs.rmdirSync(websiteFile('./'), { recursive: true, force: true })
}
const createDir = file => {
  return fs.mkdirSync(file)
}
const readFile = path => {
  return fs.readFileSync(path, { encoding: 'utf-8' })
}
const whiteFile = (path, content) => {
  return fs.writeFileSync(path, content, { encoding: 'utf-8', flag: 'w' })
}
const readDir = (path) => {
  return fs.readdirSync(path)
}

const distDir = readDir(distFile('./'))

clearDir()

setTimeout(() => {
  createDir(path.join(__dirname, '../website'))

  createDir(path.join(__dirname, '../website/dist'))

  distDir.forEach(file => copyFile(distFile(file), websiteFile(`./dist/${file}`)))

  whiteFile(websiteFile('./index.html'), readFile(targetFile(homePages)).replace(introduceReg, function (s) {
    return md.render(introduce)
  }))

  examplePages.forEach(examplePage => {
    let examplePageContent = readFile(targetFile(`${examplePage}.ejs`))
    examplePageContent = examplePageContent.replace(cssReg, function (s) {
      return './dist/index.css'
    })
    examplePageContent = examplePageContent.replace(jsReg, function (s) {
      return './dist/index.js'
    })
    whiteFile(websiteFile(`${examplePage}.html`), examplePageContent)
  })
})
