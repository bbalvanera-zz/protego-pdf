if (process.platform !== 'win32') {
  throw Error('unsupported platform');
}

const { spawn } = require('child_process');

const path       = require('path');
const getMsBuildPath = require('./whereMsBuild');
const solution   = path.join(__dirname, '..', 'src', 'csharp', 'ProtegoPdf.sln');

getMsBuildPath()
  .then(validateMsbuild)
  .then(restore)
  .then(build)
  .then(_ => console.log('Done building'))
  .catch(err => console.error(err))

function validateMsbuild(msbuild) {
  if (msbuild === '') {
    const msg = `Could not find MSBuild.exe.
    Please install Visual Studio 2017 or Build Tools for Visual Studio 2017.
    More info can be found at: https://www.visualstudio.com/downloads/`;

    throw new Error(msg)
  }

  return msbuild;
}

function restore(msbuild) {
  return new Promise((resolve, reject) => {
    console.log('Restoring dependencies');

    const nuget = path.join(__dirname, 'bin/nuget.exe');
    spawn(nuget, ['restore', solution], { stdio: 'inherit' })
      .on('error', (err) => reject(err))
      .on('close', (code) => resolve(msbuild));
  });
}

function build(msbuild) {
  return new Promise((resolve, reject) => {
    console.log(`Building protego-pdf-helper.`);

    spawn(msbuild, [solution, '/t:Build', '/p:Configuration=Release'], { stdio: 'inherit' })
      .on('error', (err) => reject(err))
      .on('close', (code) => resolve(code));
  });
}
