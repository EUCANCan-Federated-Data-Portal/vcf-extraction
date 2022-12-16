import { fallback, AnnotationExtension, failure, Result, success, Variant, Success } from '../../types';
import { emptyToUndefined, safeParseFloat, safeParseInt } from '../../utils/stringUtils';
import { Annotation, Frequency } from './types';
import { isNotEmpty } from './utils';

const BOOLEAN_TRUE_STRING = 'YES';

/**
 * Parser metadata is untyped, so we validate contents before manipulating it.
 * For EnsembleVEP annotations, we need CSQ Metadata to have the property `Description` with a string like:
 * "Consequence annotations from Ensembl VEP. Format: Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp|cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|Existing_variation|DISTANCE|STRAND|FLAGS|VARIANT_CLASS|SYMBOL_SOURCE|HGNC_ID|CANONICAL|MANE_SELECT|MANE_PLUS_CLINICAL|TSL|APPRIS|CCDS|ENSP|SWISSPROT|TREMBL|UNIPARC|UNIPROT_ISOFORM|GENE_PHENO|SIFT|PolyPhen|DOMAINS|miRNA|AF|AFR_AF|AMR_AF|EAS_AF|EUR_AF|SAS_AF|AA_AF|EA_AF|gnomAD_AF|gnomAD_AFR_AF|gnomAD_AMR_AF|gnomAD_ASJ_AF|gnomAD_EAS_AF|gnomAD_FIN_AF|gnomAD_NFE_AF|gnomAD_OTH_AF|gnomAD_SAS_AF|MAX_AF|MAX_AF_POPS|FREQS|CLIN_SIG|SOMATIC|PHENO|PUBMED|MOTIF_NAME|MOTIF_POS|HIGH_INF_POS|MOTIF_SCORE_CHANGE|TRANSCRIPTION_FACTORS"
 */
type CsqMetadata = {
	Description: string;
};
const validateCsqMetadata = (input: any): input is CsqMetadata => {
	const descriptionRegex = /^.+: ([\w]+\|)+[\w]+$/;
	return (
		typeof input === 'object' &&
		input != null &&
		input.Description &&
		typeof input.Description === 'string' &&
		(input.Description as string).match(descriptionRegex)
	);
};

/**
 * The expected format of the CSQ Descritpion string would look like:
 * "Consequence annotations from Ensembl VEP. Format: Allele|Consequence|IMPACT|SYMBOL|Gene|Feature_type|Feature|BIOTYPE|EXON|INTRON|HGVSc|HGVSp|cDNA_position|CDS_position|Protein_position|Amino_acids|Codons|Existing_variation|DISTANCE|STRAND|FLAGS|VARIANT_CLASS|SYMBOL_SOURCE|HGNC_ID|CANONICAL|MANE_SELECT|MANE_PLUS_CLINICAL|TSL|APPRIS|CCDS|ENSP|SWISSPROT|TREMBL|UNIPARC|UNIPROT_ISOFORM|GENE_PHENO|SIFT|PolyPhen|DOMAINS|miRNA|AF|AFR_AF|AMR_AF|EAS_AF|EUR_AF|SAS_AF|AA_AF|EA_AF|gnomAD_AF|gnomAD_AFR_AF|gnomAD_AMR_AF|gnomAD_ASJ_AF|gnomAD_EAS_AF|gnomAD_FIN_AF|gnomAD_NFE_AF|gnomAD_OTH_AF|gnomAD_SAS_AF|MAX_AF|MAX_AF_POPS|FREQS|CLIN_SIG|SOMATIC|PHENO|PUBMED|MOTIF_NAME|MOTIF_POS|HIGH_INF_POS|MOTIF_SCORE_CHANGE|TRANSCRIPTION_FACTORS"
 *
 * This splits apart the text before `: ` from the header list afterwards, then splits the list on `|`
 * @param input
 * @returns
 */
const getCsqAnnotationHeaders = (input: string): string[] => {
	// return input.split(': ').slice(-1)[0].split('|'); // how to one liner, but not fun to read
	const descriptionSplit = input.split(': ');
	const descriptionFormat = descriptionSplit[descriptionSplit.length - 1];
	return descriptionFormat.split('|');
};
/**
 * This is a map from header name to the index in the pipe-separated-value string.
 * This is used to map from header name to values in the CSQ values for each CSQ value of the variant.
 *
 * The input is an array of the header labels,
 * and the return value will be an object mapping each label to their index in the input array
 * @param headers
 * @returns
 */
type HeaderIndexMap = Record<string, number>;
const getAnnotationHeaderMap = (csqDescription: string): HeaderIndexMap => {
	const headers = getCsqAnnotationHeaders(csqDescription);

	const output: Record<string, number> = {};
	headers.forEach((label, index) => {
		output[label] = index;
	});
	return output;
};

type EnsembleVepVariant = Variant & { INFO: { CSQ: string[] } };
const validateEnsembleVepVariant = (input: Variant): input is EnsembleVepVariant => {
	const csqValueRegex = /[\w]+\|[\w]+/;

	// Makesure
	return (
		// Make sure INFO is an object, not null or undefined
		typeof input.INFO === 'object' &&
		input.INFO != null &&
		// Make sure we have INFO.CSQ as an array
		input.INFO.CSQ &&
		typeof input.INFO.CSQ === 'object' &&
		input.INFO.CSQ instanceof Array &&
		// Make sure every element in the INFO.CSQ array matches the expected string format
		input.INFO.CSQ.every((i) => i && typeof i === 'string' && i.match(csqValueRegex))
	);
};

/* ***** Mapping Annotation Data ***** */
/**
 * Unsafe property getter, this will throw if the header is not found or if the CSQ data does not have sufficent data.
 * Make sure you catch errors.
 * Using this instead of building a map means we can throw errors instead of fighting with the typescript guards for undefined checking
 * @param headerIndexMap
 * @param fields
 * @returns
 */
const getCsqProperty =
	(headerIndexMap: HeaderIndexMap, fields: string[]) =>
	(property: string): string => {
		if (!Object.hasOwn(headerIndexMap, property)) {
			throw new Error(`Property not defined in VCF's CSQ metadata: ${property}`);
		}
		const index = headerIndexMap[property];
		if (index >= fields.length) {
			throw new Error(`CSQ Value does not include enough values to find property "${property}" at index ${index}`);
		}
		return fields[index];
	};

const buildAnnotation =
	(headerIndexMap: HeaderIndexMap) =>
	(csq: string): Result<Annotation> => {
		const fields = csq.split('|');
		const propertyFinder = getCsqProperty(headerIndexMap, fields);

		try {
			const aaSplit = propertyFinder('Amino_acids').split('/');
			const cdnaSplit = propertyFinder('cDNA_position').split('/');
			const cdsSplit = propertyFinder('CDS_position').split('/');
			const codonsSplit = propertyFinder('Codons').split('/');
			const existingVariationSplit = propertyFinder('Existing_variation').split('&');
			const exonSplit = propertyFinder('EXON').split('/');
			const intronSplit = propertyFinder('INTRON').split('/');
			const proteinSplit = propertyFinder('Protein_position').split('/');

			const impactScoreRegex = /([\w]+)\((-?[0-9]+(\.[0-9]*)?)\)/;
			const impaceScoreGroups = { impact: 1, score: 2 };
			const polyphenMatches = impactScoreRegex.exec(propertyFinder('PolyPhen'));
			const siftMatches = impactScoreRegex.exec(propertyFinder('SIFT'));

			const output: Annotation = {
				amino_acids_reference: emptyToUndefined(aaSplit[0]),
				amino_acids_variant: emptyToUndefined(aaSplit[1]),
				biotype: emptyToUndefined(propertyFinder('BIOTYPE')),
				canonical: propertyFinder('CANONICAL') === BOOLEAN_TRUE_STRING,
				ccds: emptyToUndefined(propertyFinder('CCDS')),
				cdna_position: safeParseInt(cdnaSplit[0]),
				cdna_length: safeParseInt(cdnaSplit[1]),
				cds_position: safeParseInt(cdsSplit[0]),
				cds_length: safeParseInt(cdsSplit[1]),
				clin_sig: emptyToUndefined(propertyFinder('CLIN_SIG')),
				codons_reference: emptyToUndefined(codonsSplit[0]),
				codons_variant: emptyToUndefined(codonsSplit[1]),
				consequence: propertyFinder('Consequence').split('&').filter(isNotEmpty),
				cosmic: existingVariationSplit.filter((variation) => variation.startsWith('COS')),
				dbsnp: existingVariationSplit.filter((variation) => variation.startsWith('rs')),
				exon_rank: safeParseInt(exonSplit[0]),
				exon_total: safeParseInt(exonSplit[1]),
				feature_type: emptyToUndefined(propertyFinder('Feature_type')),
				feature_strand: emptyToUndefined(propertyFinder('STRAND')),
				gene_pheno: safeParseInt(propertyFinder('GENE_PHENO')),
				gene_symbol: emptyToUndefined(propertyFinder('SYMBOL')),
				hgvsc: emptyToUndefined(propertyFinder('HGVSc')),
				hgvsp: emptyToUndefined(propertyFinder('HGVSp')),
				high_inf_pos: emptyToUndefined(propertyFinder('HIGH_INF_POS')),
				intron_rank: safeParseInt(intronSplit[0]),
				intron_total: safeParseInt(intronSplit[1]),
				mane_plus_clinical: emptyToUndefined(propertyFinder('MANE_PLUS_CLINICAL')),
				mane_select: emptyToUndefined(propertyFinder('MANE_SELECT')),
				motif_name: emptyToUndefined(propertyFinder('MOTIF_NAME')),
				motif_pos: safeParseInt(propertyFinder('MOTIF_POS')),
				motif_score_change: safeParseFloat(propertyFinder('MOTIF_SCORE_CHANGE')),
				polyphen_impact: polyphenMatches ? polyphenMatches[impaceScoreGroups.impact] : undefined,
				polyphen_score: safeParseFloat(polyphenMatches ? polyphenMatches[impaceScoreGroups.score] : undefined),
				protein_position: safeParseInt(proteinSplit[0]),
				protein_length: safeParseInt(proteinSplit[1]),
				pubmed: propertyFinder('PUBMED').split('&').filter(isNotEmpty),
				sift_impact: siftMatches ? siftMatches[impaceScoreGroups.impact] : undefined,
				sift_score: safeParseFloat(siftMatches ? siftMatches[impaceScoreGroups.score] : undefined),
				uniparc: emptyToUndefined(propertyFinder('UNIPARC')),
				uniprotkb_swissprot: emptyToUndefined(propertyFinder('SWISSPROT')),
				uniprotkb_trembl: emptyToUndefined(propertyFinder('TREMBL')),
				variant_class: emptyToUndefined(propertyFinder('VARIANT_CLASS')),
				vep_impact: emptyToUndefined(propertyFinder('IMPACT')),
				transcription_factors: propertyFinder('TRANSCRIPTION_FACTORS').split('&').filter(isNotEmpty),
			};
			return success(output);
		} catch (err) {
			return failure(`${err}`);
		}
	};

const buildFrequency =
	(headerIndexMap: HeaderIndexMap) =>
	(csq: string): Frequency => {
		const fields = csq.split('|');
		const propertyFinder = getCsqProperty(headerIndexMap, fields);
		const output: Frequency = {
			'1000_genomes': {
				af: safeParseFloat(propertyFinder('AF')),
				afr_af: safeParseFloat(propertyFinder('AFR_AF')),
				amr_af: safeParseFloat(propertyFinder('AMR_AF')),
				eas_af: safeParseFloat(propertyFinder('EAS_AF')),
				eur_af: safeParseFloat(propertyFinder('EUR_AF')),
				sas_af: safeParseFloat(propertyFinder('SAS_AF')),
			},
			esp: {
				aa_af: safeParseFloat(propertyFinder('AA_AF')),
				ea_af: safeParseFloat(propertyFinder('EA_AF')),
			},
			gnomad_exomes: {
				af: safeParseFloat(propertyFinder('gnomAD_AF')),
				afr_af: safeParseFloat(propertyFinder('gnomAD_AFR_AF')),
				amr_af: safeParseFloat(propertyFinder('gnomAD_AMR_AF')),
				asj_af: safeParseFloat(propertyFinder('gnomAD_ASJ_AF')),
				eas_af: safeParseFloat(propertyFinder('gnomAD_EAS_AF')),
				fin_af: safeParseFloat(propertyFinder('gnomAD_FIN_AF')),
				nfe_af: safeParseFloat(propertyFinder('gnomAD_NFE_AF')),
				oth_af: safeParseFloat(propertyFinder('gnomAD_OTH_AF')),
				sas_af: safeParseFloat(propertyFinder('gnomAD_SAS_AF')),
			},
			// max_af: '';
			// max_af_pop: '';
		};

		return output;
	};

// const buildObservation =
// 	(headerIndexMap: HeaderIndexMap) =>
// 	(csq: string): Observation => {
// 		const fields = csq.split('|');
// 		const propertyFinder = getCsqProperty(headerIndexMap, fields);
// 		const output: Observation = {
// 			read_depth: {
// 				n_alt_count: safeParseInt(propertyFinder('MOTIF_POS')),
// 				n_ref_count: safeParseInt(propertyFinder('MOTIF_POS')),
// 				t_alt_count: safeParseInt(propertyFinder('MOTIF_POS')),
// 				t_ref_count: safeParseInt(propertyFinder('MOTIF_POS')),
// 			};
// 			workflow: {
// 				variant_caller: string[];
// 			};
// 		};

// 		return output;
// 	};

/* ********************************* *
 * Ensemble VEP Annotation Extension *
 * ********************************* */
export type EnsembleVepAnnotation = { annotations: Annotation[]; frequencies: Frequency[] };

/**
 * Adds mutation consequence and frequency data to a variant based on Ensemble VEP annotations
 * @param data
 * @returns
 */
const ensembleVepParser: AnnotationExtension<EnsembleVepAnnotation> = (data) => {
	const { variant, parser } = data;

	if (!validateEnsembleVepVariant(variant)) {
		return fallback(variant, 'Variant does not have CSQ annotation data');
	}

	const csqHeader = parser.getMetadata('INFO', 'CSQ');
	if (!validateCsqMetadata(csqHeader)) {
		return fallback(variant, 'VCF Header does not contain CSQ metadata description');
	}
	const headerIndexMap = getAnnotationHeaderMap(csqHeader.Description);

	const annotationResults = variant.INFO.CSQ.map(buildAnnotation(headerIndexMap));
	const frequencies = variant.INFO.CSQ.map(buildFrequency(headerIndexMap));

	const annotations = annotationResults.filter((i): i is Success<Annotation> => i.success).map((i) => i.data);

	const output: Variant & EnsembleVepAnnotation = Object.assign({}, variant, {
		annotations,
		frequencies,
	});

	return success(output);
};

export default ensembleVepParser;
