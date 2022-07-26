#!/usr/bin/env node

const {execSync} = require('child_process');
const { copyFileSync, readdirSync } = require('fs');
const { resolve } = require('path');

execSync('npm run build');

const files = readdirSync(resolve('./packages/renderer/dist'));

files.forEach(file => {
  if(file === 'index.html') return;
  if(file.endsWith('.js.map'))
    copyFileSync(resolve('./packages/renderer/dist/', file), './cordova/www/app.js.map');
  if(file.endsWith('.js'))
    copyFileSync(resolve('./packages/renderer/dist/', file), './cordova/www/app.js');
});

try {
  const proc = execSync('npm run cordova run', {
    cwd: resolve('./cordova'),
  });
} catch(e) {
  console.log(e.output.toString());
}

// console.log(proc.toString());