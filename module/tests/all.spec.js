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

describe('when checking if is pdf document', () => {
  let isPdfDocument;

  beforeAll(() => {
      isPdfDocument = require('../lib/').isPdfDocument;
  });

  it('should return true if indeed a pdf document', (done) => {
    isPdfDocument('./tests/test-data/test.pdf').then(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should return false if is not a pdf document', (done) => {
    isPdfDocument('./tests/test-data/invalid.pdf').then(result => {
      expect(result).toBe(false);
      done();
    });
  });

  it('should return true even if file is encrypted', (done) => {
    isPdfDocument('./tests/test-data/test.encrypted[test].pdf').then(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should return false if file is corrupted', (done) => {
    isPdfDocument('./tests/test-data/test.corrupted.pdf').then(result => {
      expect(result).toBe(false);
      done();
    });
  });

  it('should fail if not a valid path', (done) => {
      isPdfDocument('/:aninvalid/path.pdf').then(
        result => {
          throw new Error('Invalid expectation');
          done();
        },
        err => {
          expect(err).toBeDefined();
          expect(err.errorType).toBe('Invalid_Argument');
          done();
        }
      )
  });

  it('should fail if empty argument', (done) => {
    isPdfDocument(null).then(
      result => {
        throw new Error('Invalid Expectation');
        done();
      },
      err => {
        expect(err).toBeDefined();
        expect(err).toBe('Invalid request');
        done();
      }
    )
  });
});

describe('when checking if is protected', () => {
  let isProtected;
  beforeAll(() => {
      isProtected = require('../lib/').isProtected;
  });

  it('should return true if is protected', (done) => {
    isProtected('./tests/test-data/test.encrypted[test].pdf').then(
      result => {
        expect(result).toBe(true);
        done();
      }
    )
  });

  it('should return false if not protected', (done) => {
    isProtected('./tests/test-data/test.pdf').then(
      result => {
        expect(result).toBe(false);
        done();
      }
    )
  });

  it('should fail if not a valid file', (done) => {
    isProtected('./tests/test-data/invalid.pdf').then(
      result => {
        throw new Error('Invalid expectation');
      },
      err => {
        expect(err).toBeDefined();
        expect(err.errorType).toBe('Not_A_Pdf_Document');
        done();
      }
    )
  });
});

describe('when unlocking locked file', () => {
  let unlock;

  beforeAll(() => {
    unlock = require('../lib/').unlock;
  });

  it('should unlock if correct password', (done) => {
    unlock('./tests/test-data/test.encrypted[test].pdf', './tests/test-data/test.unlocked.pdf', 'test').then(
      result => {
        expect(result).toBeNull();
        done();
      }
    )
  });
});
