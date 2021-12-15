const path = require('path')
const { terser } = require('rollup-plugin-terser')
const scss = require('rollup-plugin-scss')
const babel = require('rollup-plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')
const commonjs = require('@rollup/plugin-commonjs')
const rootDir = process.cwd()

export default {
  input: path.join(rootDir, 'src/index.js'),
  output: [
    {
      file: path.join(rootDir, 'dist/index.js'),
      name: 'scrollToUp',
      format: 'umd'
    }
  ],
  plugins: [
    nodeResolve({
      preferBuiltins: false
    }),
    commonjs(),
    babel({
      runtimeHelpers: true
    }),
    terser(),
    scss({
      processor: () => postcss([autoprefixer()]),
      outputStyle: 'compressed'
    })
  ]
}
