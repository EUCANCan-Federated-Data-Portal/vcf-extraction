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
			'A|splice_region_variant&synonymous_variant&NMD_transcript_variant,upstream_gene_variant|MODIFIER,LOW,MODERATE|gene_symbol|ENSG00000264208|Transcript|ENST00000412397|miRNA,protein_coding,antisense|53/93|2/14|hgvsc|hgvsp|361/1696|1426/3876|37/323|12/34|aAa/aCa|COSV57135585&rs1000151449&COSVtest&rs1000test&garbage|distance|1|flags|SNV|||YES|mane_select|plus_clinical|tsl|appris|CCDS45064.1|ensp|BLMH_HUMAN|D6RGY0_HUMAN|UPI000002A538|uniprot-isoform|4|tolerated(1.2)|benign(0.014)|domains|mirna|4.78E-05|afr-af|amr-af|eas-af|eur-af|sas-af|aa-af|ea-af|gnom-ad-af|gnom-ad-afr-af|gnom-ad-amr-af|gnom-ad-asj-af|gnom-ad-eas-af|gnom-ad-fin-af|gnom-ad-nfe-af|gnom-ad-oth-af|gnom-ad-sas-af|max-af|maf-af-pops|freqs|clin-sig|somatic|pheno|24033266&23757202&25157968&26619011&12068308&12960123&14679157&15035987&21639808&22048237&22663011&22972589&19206169&12198537&16953233&16187918|ENSPFM0017|21|Y|-0.037|ELK1::HOXB13&HOXB13::ETV1&FLI1::HOXB13&HOXB13::ELK1&HOXD12::ELK3&HOXD12::ETV1&HOXD12::ETV4&ETV2::HOXB13&ETV5::HOXB13',
			'A|downstream_gene_variant|MODIFIER|RNF223|ENSG00000237330|Transcript|ENST00000453464|protein_coding|||||||||||1641|-1||SNV|HGNC|HGNC:40020|YES|NM_001205252.2||2|P1|CCDS53257.1|ENSP00000410533|E7ERA6.73||UPI0001A5E6EF|||||||||||||||||||||||||||||||||||',
		],
	},
	REF: 'T',
	FILTER: 'PASS',
	ID: null,
	QUAL: null,
	SAMPLES: {},
} satisfies Variant;

ensembleVep.ALT;

export const variants = {
	annotated: {
		ensembleVep,
	},
} satisfies { annotated: Record<string, Variant> };
