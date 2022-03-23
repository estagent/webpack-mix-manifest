const fs = require('fs')
const path = require('path')

const defaultOptions = {
  mixManifest: 'auto', // mix-manifest.json at webroot:  but should be define ASSET_PATH environment.  https://webpack.js.org/guides/public-path/
  hashPattern: '[a-f0-9]{hashDigestLength}', // {hash}
  namePattern: '[\\.-]', //  name-{hash}
  queryPattern: '\\?[w_]=', // ?_={hash}
  resources: false, // if false only js/css updated in manifest
  extensions: null, // override resources option
  // extensions: ['js', 'css'],
}

module.exports = class MixManifest {
  constructor(options = {}) {
    this.options = this.mergeOptions(options, defaultOptions)
  }

  mergeOptions(options, defaults) {
    for (const key of Object.keys(defaults)) {
      if (options.hasOwnProperty(key)) {
        defaults[key] = options[key]
      }
    }
    return defaults
  }

  apply(compiler) {
    const opts = this.options
    let asset_path

    compiler.hooks.done.tap('MixManifest', stats => {
      const assets = stats.compilation.assetsInfo
      const output = stats.compilation.outputOptions
      const hashDigestLength = output.hashDigestLength.toString()

      asset_path = output.publicPath ?? '/'
      if (output.publicPath === 'auto') {
        // if (!process.env.ASSET_PATH) throw 'ASSET_PATH env is not defined! Please set ASSET_PATH in  EnvironmentPlugin '
        asset_path = process.env.ASSET_PATH ?? '/'
      }
      if (asset_path === '') asset_path = '/'

      this.mixPath = opts.mixManifest !== 'auto'
        ? path.resolve(opts.mixManifest)
        : output.path
          .replace(asset_path.replace(/\/$/, ''), '')
          .concat('/mix-manifest.json')

      if (process.env.DEBUG || process.env.APP_DEBUG) {

        console.log(' DEBUG', {
          output: output.path,
          publicPath: output.publicPath,
          asset_path: asset_path,
          mixPath: this.mixPath,
        })
      }

      const mixManifest = this.getMixManifest()

      let mixChanged = false

      const reHashed = new RegExp(opts.hashPattern.replace('hashDigestLength', hashDigestLength))
      const reNameHash = new RegExp(opts.namePattern.concat(opts.hashPattern).replace('hashDigestLength', hashDigestLength))
      const reQueryHash = new RegExp(opts.queryPattern.concat(opts.hashPattern).replace('hashDigestLength', hashDigestLength))
      const reExt = new RegExp('^'.concat(opts.extensions ? opts.extensions.join('|') : (opts.resources ? '.*' : 'css|js')).concat('$'))
      const reAsset = /^css|js$/


      assets.forEach(function(assetInfo, asset) {
        const assetExt = asset.split('?').shift().split('.').pop()

        if (!reExt.test(assetExt)) return
        let mixAsset = {}

        if (!reAsset.test(assetExt) && assetInfo.sourceFilename) {
          mixAsset.key = assetInfo.sourceFilename
          mixAsset.file = asset_path.concat(asset)
        } else if (reQueryHash.test(asset)) {
          mixAsset.key = asset_path.concat(asset.replace(reQueryHash, ''))
          mixAsset.file = asset_path.concat(asset)
        } else if (reNameHash.test(asset)) {
          mixAsset.file = asset_path.concat(asset)
          mixAsset.key = mixAsset.file.replace(reNameHash, '')
        } else if (reHashed.test(asset)) {
          console.log(
            `ERROR: asset (${asset}) has hash but format is not supported. check options to solve`,
          )
        }

        if (!mixAsset.key) {
          console.log(`asset (${asset}) is not hashed`)

        } else if (!mixManifest[mixAsset.key] || mixManifest[mixAsset.key] !== mixAsset.file) {
          mixManifest[mixAsset.key] = mixAsset.file
          mixChanged = true
        }
      })
      if (mixChanged) {
        if (this.updateMixManifest(mixManifest)) {
          console.log(`[${this.mixPath} updated]`)
        }
      }
    })
  }

  getMixManifest() {
    try {
      return JSON.parse(fs.readFileSync(this.mixPath, 'utf8'))
    } catch (e) {
      return {}
    }
  }

  updateMixManifest(data) {
    try {
      fs.writeFileSync(this.mixPath, JSON.stringify(data, null, 2))
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
