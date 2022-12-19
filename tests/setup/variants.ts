import { Variant } from '../../src';

const ensembleVep = {
	CHROM: 'chr1',
	POS: 1069326,
	ALT: ['A'],
	INFO: {
		AS_FilterStatus: ['SITE'],
		AS_SB_TABLE: ['6', '148|0', '19'],
		DP: [176],
		ECNT: [1],
		GERMQ: [93],
		MBQ: [29, 29],
		MFRL: [192, 198],
		MMQ: [60, 60],
		MPOS: [34],
		NALOD: [2.06],
		NLOD: [33.55],
		POPAF: [6],
		ROQ: [93],
		TLOD: [46.82],
		CSQ: [
			'A|splice_region_variant&synonymous_variant&NMD_transcript_variant,upstream_gene_variant|MODIFIER|gene_symbol|ENSG00000264208|Transcript|ENST00000412397|miRNA|53/93|2/14|hgvsc|hgvsp|361/1696|1426/3876|37/323|12/34|aAa/aCa|COSV57135585&rs1000151449&COSVtest&rs1000test&garbage|distance|1|flags|SNV|||YES|mane_select|plus_clinical|tsl|appris|CCDS45064.1|ensp|BLMH_HUMAN|D6RGY0_HUMAN|UPI000002A538|uniprot-isoform|4|tolerated(1.2)|benign(0.014)|domains|mirna|4.78E-05|5.78E-05|0.00123|9.87E-08|1.23E1|3.45E-05|4.56E-05|5.67E-05|6.78E-05|7.89E-05|8.91E-04|9.12E-04|1.23E-04|2.34E-04|3.45E-04|4.56E-04|5.67E-04|6.78E-04|7.89E-04|freqs|clin-sig|somatic|pheno|24033266&23757202&25157968&26619011&12068308&12960123&14679157&15035987&21639808&22048237&22663011&22972589&19206169&12198537&16953233&16187918|ENSPFM0017|21|Y|-0.037|ELK1::HOXB13&HOXB13::ETV1&FLI1::HOXB13&HOXB13::ELK1&HOXD12::ELK3&HOXD12::ETV1&HOXD12::ETV4&ETV2::HOXB13&ETV5::HOXB13',
			'A|downstream_gene_variant|MODIFIER|RNF223|ENSG00000237330|Transcript|ENST00000453464|protein_coding|||||||||||1641|-1||SNV|HGNC|HGNC:40020|YES|NM_001205252.2||2|P1|CCDS53257.1|ENSP00000410533|E7ERA6.73||UPI0001A5E6EF|||||||||||||||||||||||||||||||||||',
		],
	},
	REF: 'T',
	FILTER: 'PASS',
	ID: null,
	QUAL: null,
	SAMPLES: {
		SA601681: {
			GT: ['0/0'],
			AD: [117, 0],
			AF: [0.008728],
			DP: [117],
			F1R2: [54, 0],
			F2R1: [60, 0],
			SB: [6, 111, 0, 0],
		},
		SA602282: {
			GT: ['0/1'],
			AD: [37, 19],
			AF: [0.346],
			DP: [56],
			F1R2: [15, 10],
			F2R1: [19, 9],
			SB: [0, 37, 0, 19],
		},
	},
} satisfies Variant;

ensembleVep.ALT;

export const variants = {
	annotated: {
		ensembleVep,
	},
} satisfies { annotated: Record<string, Variant> };
