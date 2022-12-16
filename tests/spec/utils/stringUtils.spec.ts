import { describe } from 'mocha';
import { expect } from 'chai';
import { emptyToUndefined, safeParseFloat, safeParseInt } from '../../../src/utils/stringUtils';

describe('Utils - StringUtils', () => {
	describe('emptyToUndefined', () => {
		it('should return string values', () => {
			const input = 'input';
			expect(emptyToUndefined(input)).to.equal(input);
		});
		it('should return undefined for empty string', () => {
			expect(emptyToUndefined('')).to.be.undefined;
		});
	});

	describe('safeParseInt', () => {
		it('should parse numeric strings to integers', () => {
			expect(safeParseInt('0')).to.equal(0);
			expect(safeParseInt('2.')).to.equal(2); // accept decimal and no digits
			expect(safeParseInt('3.0')).to.equal(3); // accept 0s after decimal
			expect(safeParseInt('4.00000')).to.equal(4); // accept many 0s after decimal
			expect(safeParseInt('-56')).to.equal(-56); // accept negatives
		});
		it('should trim whitespace and parse normally', () => {
			expect(safeParseInt('	7   ')).to.equal(7);
			expect(safeParseInt('	-8   ')).to.equal(-8);
		});
		it('should parse non-integer strings to undefined', () => {
			expect(safeParseInt()).to.be.undefined;
			expect(safeParseInt('')).to.be.undefined;
			expect(safeParseInt('NaN')).to.be.undefined;
			expect(safeParseInt('Infinity')).to.be.undefined;
			expect(safeParseInt('asdf')).to.be.undefined;
			expect(safeParseInt('1.5')).to.be.undefined; // needs to reject non 0s after decimal
			expect(safeParseInt('2/3')).to.be.undefined; // reject fractions
			expect(safeParseInt('- 3')).to.be.undefined; // reject bad formatting
			expect(safeParseInt('.0')).to.be.undefined; // reject start with decimal
			expect(safeParseInt('1.23E-4')).to.be.undefined; // reject scientific notation exponents
		});
	});
	describe('safeParseFloat', () => {
		it('should parse numeric strings to integers', () => {
			expect(safeParseFloat('0')).to.equal(0);
			expect(safeParseFloat('2.')).to.equal(2); // accept decimal and no digits
			expect(safeParseFloat('3.2')).to.equal(3.2); // accept digits after decimal
			expect(safeParseFloat('4.00300')).to.equal(4.003); // accept many 0s after decimal
			expect(safeParseFloat('-56.54')).to.equal(-56.54); // accept negatives
			expect(safeParseFloat('.23')).to.equal(0.23); // accept start with decimal
			expect(safeParseFloat('1.23E-02')).to.equal(0.0123); // accept scientific notation exponents
		});
		it('should trim whitespace and parse normally', () => {
			expect(safeParseFloat('	7.8   ')).to.equal(7.8);
			expect(safeParseFloat('	-9.01   ')).to.equal(-9.01);
		});
		it('should parse non-integer strings to undefined', () => {
			expect(safeParseFloat()).to.be.undefined;
			expect(safeParseFloat('')).to.be.undefined;
			expect(safeParseFloat('NaN')).to.be.undefined;
			expect(safeParseFloat('Infinity')).to.be.undefined;
			expect(safeParseFloat('asdf')).to.be.undefined;
			expect(safeParseFloat('2/3')).to.be.undefined; // reject fractions
			expect(safeParseFloat('- 3')).to.be.undefined; // reject bad formatting
		});
	});
});
