const { spawn } = require('child_process');
const path = require('path');
const msbuild = 'MSBuild\\15.0\\Bin\\MSBuild.exe';

module.exports = function() {
  return vswhere().then(installPath => {
    return installPath === '' ? installPath : path.join(installPath, msbuild);
  });
};

function vswhere() {
  return new Promise((resolve, reject) => {
    // https://github.com/Microsoft/vswhere/wiki/Find-MSBuild
    const where = spawn(path.join(__dirname, 'bin/vswhere.exe'), [
      '-latest',
      '-products',
      '*',
      '-requires',
      'Microsoft.Component.MSBuild',
      '-property',
      'installationPath']);

    where.stdout.once('data', (data) => {
      const result = data.toString('utf8');
      const installPath = result.replace('\r\n', '');

      resolve(installPath);
    });

    where.stderr.once('data', (data) => {
      const err = data.toString('utf8');

      console.error(err);
      reject(err);
    });

    where.once('close', () => resolve(''));
  });
}
