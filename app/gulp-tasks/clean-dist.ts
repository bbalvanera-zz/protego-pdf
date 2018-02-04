import * as del from 'del';

function cleanDist() {
  return del(['dist/']);
}

export = cleanDist;
