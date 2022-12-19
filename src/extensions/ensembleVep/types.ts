export type Annotation = {
	// aa_change: string;
	amino_acids_reference?: string;
	amino_acids_variant?: string;
	biotype?: string;
	canonical: boolean;
	ccds?: string;
	cdna_position?: number;
	cdna_length?: number;
	cds_position?: number;
	cds_length?: number;
	clin_sig?: string;
	// coding_dna_change?:string
	codons_reference?: string;
	codons_variant?: string;
	consequence: string[];
	cosmic: string[];
	dbsnp: string[];
	// domains: [];
	// ensembl_gene_id?:string';
	// ensembl_feature_id?:string';
	exon_rank?: number;
	exon_total?: number;
	feature_type?: string;
	feature_strand?: string;
	gene_pheno?: number;
	gene_symbol?: string;
	hgvsc?: string;
	hgvsp?: string;
	high_inf_pos?: string;
	intron_rank?: number;
	intron_total?: number;
	mane_plus_clinical?: string;
	mane_select?: string;
	motif_name?: string;
	motif_pos?: number;
	motif_score_change?: number;
	polyphen_impact?: string;
	polyphen_score?: number;
	protein_position?: number;
	protein_length?: number;
	pubmed: string[];
	sift_impact?: string;
	sift_score?: number;
	transcription_factors: string[];
	uniparc?: string;
	uniprotkb_swissprot?: string;
	uniprotkb_trembl?: string;
	variant_class?: string;
	vep_impact?: string;
};
export type Frequency = {
	'1000_genomes': {
		af?: number;
		afr_af?: number;
		amr_af?: number;
		eas_af?: number;
		eur_af?: number;
		sas_af?: number;
	};
	esp: {
		aa_af?: number;
		ea_af?: number;
	};
	gnomad_exomes: {
		af?: number;
		afr_af?: number;
		amr_af?: number;
		asj_af?: number;
		eas_af?: number;
		fin_af?: number;
		nfe_af?: number;
		oth_af?: number;
		sas_af?: number;
	};
	// max_af: '';
	// max_af_pop: '';
};
export type EnsembleVepAnnotation = { annotations: Annotation[]; frequencies: Frequency[] };

// type Observation = {
// 	read_depth: {
// 		n_alt_count?: number;
// 		n_ref_count?: number;
// 		t_alt_count?: number;
// 		t_ref_count?: number;
// 	};
// 	workflow: {
// 		variant_caller: string[];
// 	};
// };
