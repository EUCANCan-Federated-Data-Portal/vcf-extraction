import { describe } from 'mocha';
import { expect } from 'chai';
import fs from 'fs';

import VcfExtractor from '../../src/index';
import { twoVariantVcf } from '../data/vcf';

describe('Extractor', () => {
	describe('string', () => {
		it('should read the correct number of variants', async () => {
			const exporter = new VcfExtractor();

			let count = 0;
			const variantGenerator = exporter.getVariants(twoVariantVcf);
			for await (const result of variantGenerator) {
				count++;
				expect(result).to.be.a('object');
				expect(result.success).to.be.true;
			}
			expect(count).to.equal(2);
		});
	});
	describe('stream', () => {
		it('should read the correct number of variants', async () => {
			const fileStream = fs.createReadStream('./tests/data/files/hundred-variant.open-filter.VEP.annotated.vcf');

			let count = 0;

			const exporter = new VcfExtractor();
			const variantGenerator = exporter.streamVariants(fileStream);
			for await (const variant of variantGenerator) {
				count++;
				expect(variant).to.be.a('object');
			}
			expect(count).to.equal(100);
		});
	});
});
