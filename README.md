# 

Webpack5 plugin to generate mix-manifest.json like laravel-mix does
 

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

#sample mix function  (stubs/mix.php) to use outside laravel 




