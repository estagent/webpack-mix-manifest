const fs = require('fs')
const path = require('path')

const defaultOptions = {
    mixManifest: 'public/mix-manifest.json',
    assetsPath: null,
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

        defaults.mixPath = path.resolve(defaults.mixManifest)
        defaults.publicPath = path.dirname(defaults.mixPath)

        return defaults
    }

    apply(compiler) {
        const self = this
        compiler.hooks.done.tap('MixManifest', stats => {
            if (!self.options.assetsPath) {
                const filePath = stats.compilation.outputOptions.path
                if (filePath)
                    self.options.assetsPath = '/' + filePath.replace(/^.*[\\\/]/, '')
            }

            const mixManifest = JSON.parse(
                fs.readFileSync(self.options.mixPath, 'utf8'),
            )

            let mixModified = false

            for (let asset of Object.keys(stats.compilation.assets)) {
                const hashPath = this.options.assetsPath + '/' + asset
                let mixKey

                if (hashPath.match(/\./g).length > 1)
                    mixKey = hashPath.replace(/\.\w+\./, '.')

                if (!mixKey)
                    console.log(
                        `ERROR: asset (${asset}) path could not be resolved! asset not dotted ? else try  assetsPath option`,
                    )
                else if (!mixManifest[mixKey] || mixManifest[mixKey] !== hashPath) {
                    mixManifest[mixKey] = hashPath
                    mixModified = true
                }
            }

            if (mixModified) {
                const manifestJSON = JSON.stringify(mixManifest, null, 2)
                fs.writeFileSync(self.options.mixPath, manifestJSON)
                console.log(`[mixManifest updated] ${manifestJSON}`)
            }
        })
    }
}
