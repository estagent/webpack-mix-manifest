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

Options:
assets path or mix-manifest.json path can be preset.
  
default options :
{
    mixManifest: 'auto', // mix-manifest.json at webroot.    
    hashPattern: '[a-f0-9]{hashDigestLength}', // {hash}
    namePattern: '[\\.-]', //  name-{hash}
    queryPattern: '\\?[w_]=', // ?_={hash}
    resources: false, // when true,includes all assets, else only css/js 
    extensions: null,
    // extensions: ['js', 'css']  // override resources option
 })
 
 

 

#sample mix function is in mix.php file. 


Alternatively, you might check mix-version-replace module.
https://github.com/estagent/mix-version-replace


