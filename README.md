# 

Webpack5 plugin to generate mix-manifest.json like laravel-mix does

Useful for SPA frontend development with laravel-mix and without platform layout.
  

```bash
# install 
$ npm install  --save-dev webpack-mix-manifest


# Usage 

#webpack.config.js

const MixManifest = require('webpack-mix-manifest');

...

plugins: [
  new MixManifest()       
]

Options:
assets path or mix-manifest.json path can be preset.
  
default options :
{
    mixManifest: 'auto', // mix-manifest.json at webroot:  but should be define ASSET_PATH environment.  https://webpack.js.org/guides/public-path/
    hashPattern: '[a-f0-9]{hashDigestLength}', // {hash}
    namePattern: '[\\.-]', //  name-{hash}
    queryPattern: '\\?[w_]=', // ?_={hash}
    resources: false, // if false only js/css updated in manifest
    extensions: ['js', 'css']  // override resources option
 })
 
 

 
parses dotted hashed assets like.
  output: {
  
    filename: 'app.[contenthash].js',
    
 

#sample mix function is in mix.php 



Alternatively, you might check mix-version-replace module.
https://github.com/estagent/mix-version-replace


