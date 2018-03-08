if (process.platform !== 'win32') {
  throw Error('unsupported platform');
}

const { spawn } = require('child_process');

const path       = require('path');
const getMsBuildPath = require('./whereMsBuild');
const solution   = path.join(__dirname, '..', 'src', 'csharp', 'ProtegoPdf.sln');

getMsBuildPath().then(msbuild => {
  if (msbuild === '') {
    console.error('Could not find MSBuild.exe');
    console.log('Please install Visual Studio 2017 or Build Tools for Visual Studio 2017');
    console.log('More info can be found at: https://www.visualstudio.com/downloads/');

    return;
  }

  restore()
    .then(getMsBuildPath)
    .then(build)
    .then(_ => console.log('Done'))
    .catch(err => console.error(err));
});

function restore() {
  return new Promise((resolve, reject) => {
    console.log('Restoring required dependencies');

    const nuget = path.join(__dirname, 'bin/nuget.exe');
    spawn(nuget, ['restore', solution], { stdio: 'inherit' })
      .on('error', (err) => reject(err))
      .on('close', (code) => resolve(code));
  });
}

function build(msbuild) {
  return new Promise((resolve, reject) => {
    spawn(msbuild, [solution, '/t:Build', '/p:Configuration=Release'], { stdio: 'inherit' })
      .on('error', (err) => reject(err))
      .on('close', (code) => resolve(code));
  });
}
