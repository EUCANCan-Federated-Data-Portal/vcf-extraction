import VCF from '@gmod/vcf';
import { z as zod } from 'zod';

/**
 * An annotation extension to the parser is a method that will provide supplemental data to variants based on some expected annotation formatting
 * The output for each variant will be either the variant with added annotation data, or the original unmodified variant.
 * The output object includes a success boolean to indicate if the annotation data was provided successfully
 * and a message to explain why no annotation data was added if that is the case.
 */
export type AnnotationExtension<AnnotationData> = (data: {
	variant: Variant;
	parser: VCF;
}) => Either<Variant & AnnotationData, Variant>;

export const InfoValue = zod.array(zod.string().or(zod.number()).or(zod.literal(null)));
export type InfoValue = zod.infer<typeof InfoValue>;

export const Variant = zod.object({
	CHROM: zod.string(),
	POS: zod.number(),
	ALT: zod.array(zod.string().or(zod.literal(null))).or(zod.literal(null)),
	INFO: zod
		.record(zod.string(), zod.boolean().or(zod.array(zod.string().or(zod.number()).or(zod.literal(null)))))
		.optional(),
	REF: zod.string(),
	FILTER: zod.string().or(zod.array(zod.string())).or(zod.literal(null)),
	ID: zod.array(zod.string()).or(zod.literal(null)),
	QUAL: zod.number().or(zod.literal(null)),

	// // Samples is either an object with a getter, or with value of samples. this accomplishes lazy loading
	SAMPLES: zod.record(zod.string(), zod.any()),
});

export type Variant = zod.infer<typeof Variant>;

/* *** Result Type(s) *** */
export type Success<T> = { success: true; data: T };
export type Fallback<T> = { success: false; data: T; message: string };
export type Failure = { success: false; message: string };
export const success = <T>(data: T): Success<T> => ({ success: true, data });
export const fallback = <T>(data: T, message: string): Fallback<T> => ({ success: false, data, message });
export const failure = (message: string): Failure => ({ success: false, message });

export type Either<A, B> = Success<A> | Fallback<B>;
export type Result<T> = Success<T> | Failure;
