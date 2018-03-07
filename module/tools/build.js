if (process.platform !== 'win32') {
  throw Error('unsupported platform');
}
const { spawn } = require('child_process');

const fs       = require('fs');
const path     = require('path');
const where    = require('./whereMsBuild');
const nuget    = './bin/nuget.exe';
const solution = path.join(__dirname, '..', 'src', 'csharp', 'ProtegoPdf.sln');

where().then(msbuild => {
  if (msbuild === '') {
    console.error('Could not find MSBuild.exe');
    console.log('Please install Visual Studio 2017 or Build Tools for Visual Studio 2017');
    console.log('More info can be found at: https://www.visualstudio.com/downloads/');

    return;
  }

  restore(msbuild, () => {
    build(msbuild, () => {
      console.log('Done');
    });
  });
});

function restore(msbuild, cb) {
  console.log('Restoring required dependencies');
  spawn(msbuild, [solution, '/t:Restore', '/p:Configuration=Release'], { stdio: 'inherit' })
    .on('close', cb);
}

function build(msbuild, cb) {
  console.log('Building protego-pdf-helper');
  spawn(msbuild, [solution, '/t:Build', '/p:Configuration=Release'], { stdio: 'inherit' })
    .on('close', cb);
}
