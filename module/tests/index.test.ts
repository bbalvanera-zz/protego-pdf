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
