import { hashString, verifyHash } from './encrypt';

describe('encrypt utils', () => {
  describe('hashString', () => {
    it('should return a hex string of length 128 for blake2b512', () => {
      const input = 'test123';
      const hash = hashString(input);
      console.log(hash);
      expect(typeof hash).toBe('string');
      expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashString('input1');
      const hash2 = hashString('input2');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce the same hash for the same input', () => {
      const input = 'repeat';
      expect(hashString(input)).toBe(hashString(input));
    });
  });

  describe('verifyHash', () => {
    it('should return true for correct hash', () => {
      const input = 'mySecret';
      const hash = hashString(input);
      expect(verifyHash(input, hash)).toBe(true);
    });

    it('should return false for incorrect hash', () => {
      const input = 'mySecret';
      const wrongInput = 'notMySecret';
      const hash = hashString(input);
      expect(verifyHash(wrongInput, hash)).toBe(false);
    });

    it('should return false for hashes of different length', () => {
      const input = 'abc';
      const hash = hashString(input);
      // Remove last character to make length different
      const badHash = hash.slice(0, -1);
      expect(verifyHash(input, badHash)).toBe(false);
    });

    it('should throw if hash is not valid hex', () => {
      expect(verifyHash('abc', 'nothexstring')).toBe(false);
    });
  });
});
