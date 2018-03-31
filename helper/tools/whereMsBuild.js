/**
 * Copyright (C) 2018 Bernardo Balvanera
 *
 * This file is part of ProtegoPdf.
 *
 * ProtegoPdf is a free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

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
