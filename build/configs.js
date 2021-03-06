const path = require('path')
const buble = require('rollup-plugin-buble')
const replace = require('rollup-plugin-replace')
const peerDependencies = require('../package.json').peerDependencies
const version = process.env.VERSION || require('../package.json').version
const banner =
`/**
 * reward-api v${version}
 * (c) ${new Date().getFullYear()} Jun Tsai
 * @license Apache-2.0
 */`
const resolve = _path => path.resolve(__dirname, '../', _path)

const configs = {
  umdDev: {
    input: resolve('src/index.js'),
    file: resolve('dist/reward-api.js'),
    format: 'umd',
    env: 'development'
  },
  umdProd: {
    input: resolve('src/index.js'),
    file: resolve('dist/reward-api.min.js'),
    format: 'umd',
    env: 'production'
  },
  commonjs: {
    input: resolve('src/index.js'),
    file: resolve('dist/reward-api.common.js'),
    format: 'cjs'
  },
  esm: {
    input: resolve('src/index.esm.js'),
    file: resolve('dist/reward-api.esm.js'),
    format: 'es'
  },
  'esm-browser-dev': {
    input: resolve('src/index.esm.js'),
    file: resolve('dist/reward-api.esm.browser.js'),
    format: 'es',
    env: 'development',
    transpile: false
  },
  'esm-browser-prod': {
    input: resolve('src/index.esm.js'),
    file: resolve('dist/reward-api.esm.browser.min.js'),
    format: 'es',
    env: 'production',
    transpile: false
  }
}

function genConfig (opts) {
  const config = {
    input: {
      input: opts.input,
      plugins: [
        replace({
          __VERSION__: version
        })
      ],
      external: Object.keys(peerDependencies)
    },
    output: {
      banner,
      file: opts.file,
      format: opts.format,
      name: 'reward-api',
      globals: { vue: 'vue', vuex: 'vuex', 'wx-promise-pro': 'wx-promise-pro' }
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  if (opts.transpile !== false) {
    config.input.plugins.push(buble())
  }

  return config
}

function mapValues (obj, fn) {
  const res = {}
  Object.keys(obj).forEach(key => {
    res[key] = fn(obj[key], key)
  })
  return res
}

module.exports = mapValues(configs, genConfig)
