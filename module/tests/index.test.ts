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
    let isPdfDocument: (filePath: string) => Promise<any>;

    beforeAll(() => {
        isPdfDocument = require('../lib/').isPdfDocument;
    });

    it('should return true if indeed a pdf document', () => {
        expect(isPdfDocument('./tests/test-data/test.pdf')).resolves.toBe(true);
    });

    it('should return false if is not a pdf document', () => {
        expect(isPdfDocument('./tests/test-data/invalid.pdf')).resolves.toBe(false);
    });

    it('should return true even if file is encrypted', () => {
        expect(isPdfDocument('./tests/test-data/test.encrypted[test].pdf')).resolves.toBe(true);
    });

    it('should return false if file is corrupted', () => {
        expect(isPdfDocument('./tests/test-data/test.corrupted.pdf')).resolves.toBe(false);
    });

    it('should fail if not a valid path', () => {
        isPdfDocument('/:aninvalid/path.pdf')
        .then((result) => {

        })
        .catch((error) => {
            expect(error).toBeDefined();
            expect(error.errorType).toBe('Invalid_Argument');
        });
    });

    it('should fail if empty argument', () => {
        expect(isPdfDocument(null)).rejects.toBeDefined();
    });
});

describe('when checking if is protected', () => {
    let isProtected: (filePath: string) => Promise<boolean>;
    beforeAll(() => {
        isProtected = require('../lib/').isProtected;
    });

    it('should return true if is protected', () => {
        expect(isProtected('./tests/test-data/test.encrypted[test].pdf')).resolves.toBe(true);
    });

    it('should return false if not protected', () => {
        expect(isProtected('./tests/test-data/test.pdf')).resolves.toBe(false);
    });

    it('should fail if not a valid file', () => {
        expect(isProtected('./tests/test-data/invalid.pdf')).rejects.toBeDefined();
    });
});
