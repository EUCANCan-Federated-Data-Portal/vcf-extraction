import { expect } from 'chai';
import { describe } from 'mocha';

import { parseImpactScoreString } from '../../../../src/extensions/ensembleVep/utils';

describe('Extension - EnsembleVEP - Utils', () => {
	describe('parseImpactScoreString', () => {
		it('should find impact and score successfully', () => {
			const value = 'benign(0.014)';
			const output = parseImpactScoreString(value);
			expect(output.impact).to.equal('benign');
			expect(output.score).to.equal(0.014);
		});
		it('should return undefined values for invalid inputs', () => {
			const value = 'qwerty-asdf';
			const output = parseImpactScoreString(value);
			expect(output.impact).to.be.undefined;
			expect(output.score).to.be.undefined;

			// accept empty input
			expect(parseImpactScoreString()).to.deep.equal({});
		});
	});
});
