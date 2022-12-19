import { describe } from 'mocha';
import { assert, expect } from 'chai';
import fs from 'fs';

import VcfExtractor from '../../src/index';
import { twoVariantVcf } from '../data/vcf';

describe('Extractor', () => {
	describe('string', () => {
		it('should read the correct number of variants', async () => {
			const extractor = new VcfExtractor();

			let count = 0;
			const variantGenerator = extractor.generateVariants(twoVariantVcf);
			for await (const result of variantGenerator) {
				count++;
				expect(result).to.be.a('object');
				expect(result.success).to.be.true;
			}
			expect(count).to.equal(2);
		});
		it('should throw an error for vcf with badly formatted header', async () => {
			const badVcfString =
				'##fileformat=VCFv4.2\n##FAKE HEADER\n#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT\nchr1	1069326	.	T	A	.	PASS	AS_FilterStatus=SITE;AS_SB_TABLE=6,148|0,19;DP=176;ECNT=1;GERMQ=93;MBQ=29,29;MFRL=192,198;MMQ=60,60;MPOS=34;NALOD=2.06;NLOD=33.55;POPAF=6;ROQ=93;TLOD=46.82;CSQ=A|non_coding_transcript_exon_variant|MODIFIER||ENSG00000217801|Transcript|ENST00000412397|transcribed_unprocessed_pseudogene|10/10||||1190/1219|||||||1||SNV|||YES||||||||||||||||||||||||||||||||||||||||||||,A|downstream_gene_variant|MODIFIER|RNF223|ENSG00000237330|Transcript|ENST00000453464|protein_coding|||||||||||1641|-1||SNV|HGNC|HGNC:40020|YES|NM_001205252.2||2|P1|CCDS53257.1|ENSP00000410533|E7ERA6.73||UPI0001A5E6EF|||||||||||||||||||||||||||||||||||	GT:AD:AF:DP:F1R2:F2R1:SB	0/0:117,0:0.008728:117:54,0:60,0:6,111,0,0	0/1:37,19:0.346:56:15,10:19,9:0,37,0,19';
			const extractor = new VcfExtractor();

			try {
				const variantGenerator = extractor.generateVariants(badVcfString);
				for await (const result of variantGenerator) {
					assert.fail('No variants in provided string, should have thrown an error.');
				}
			} catch (e) {
				// Note: if the assert in the try block fails, e will be an AssertionError and this will fail the test
				expect(e).to.be.an('Error');
				return;
			}
			assert.fail('Test should have ended in catch block.');
		});
		it('should throw an error for vcf with badly formed variant', async () => {
			const badVcfString = '##fileformat=VCFv4.2\n#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT\ngarbage in garbasge out';
			const extractor = new VcfExtractor();

			try {
				const variantGenerator = extractor.generateVariants(badVcfString);
				for await (const result of variantGenerator) {
					assert.fail('No variants in provided string, should have thrown an error.');
				}
			} catch (e) {
				// Note: if the assert in the try block fails, e will be an AssertionError and this will fail the test
				expect(e).to.be.an('Error');
				return;
			}
			assert.fail('Test should have ended in catch block.');
		});
	});
	describe('stream', () => {
		it('should read the correct number of variants', async () => {
			const fileStream = fs.createReadStream('./tests/data/files/hundred-variant.open-filter.VEP.annotated.vcf');

			let count = 0;

			const extractor = new VcfExtractor();
			const variantGenerator = extractor.generateVariants(fileStream);
			for await (const variant of variantGenerator) {
				count++;
				expect(variant).to.be.a('object');
			}
			expect(count).to.equal(100);
		});
	});
});
