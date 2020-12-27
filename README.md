# 

Webpack plugin to generate mix-manifest.json like laravel-mix does

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

 new MixManifest({
    mixManifest:   'public/mix-manifest.json', 
    assetsPath: null,
 })
 
 

 
parses dotted hashed assets like.
  output: {
  
    filename: 'app.[contenthash].js',
    
 

#sample mix function is in mix.php 



Alternatively, you might check mix-version-replace module.
[a link](https://github.com/estagent/mix-version-replace/README.md) 


