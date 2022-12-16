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
	vep_impact?: string;
};
export type Frequency = {
	'1000_genomes': {
		af?: string;
		afr_af?: string;
		amr_af?: string;
		eas_af?: string;
		eur_af?: string;
		sas_af?: string;
	};
	esp: {
		aa_af?: string;
		ea_af?: string;
	};
	gnomad_exomes: {
		af?: string;
		afr_af?: string;
		amr_af?: string;
		asj_af?: string;
		eas_af?: string;
		fin_af?: string;
		nfe_af?: string;
		oth_af?: string;
		sas_af?: string;
	};
	// max_af: '';
	// max_af_pop: '';
};

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
