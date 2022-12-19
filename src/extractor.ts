import VCF from '@gmod/vcf';
import readline from 'readline';
import { AnnotationExtension, Either, success, Variant } from './types';
import { stringToStream } from './utils/stringUtils';

class VcfExtractor<AnnotationData = {}> {
	annotation?: AnnotationExtension<AnnotationData>;
	constructor(annotation?: AnnotationExtension<AnnotationData>) {
		this.annotation = annotation;
	}

	/**
	 * Returns an async generator of Variants from the VCF file
	 * @param vcf VCF File provided as a ReadableStream or a String
	 */
	async *generateVariants(
		vcf: NodeJS.ReadableStream | String,
	): AsyncGenerator<Either<Variant & AnnotationData, Variant>> {
		let vcfStream = typeof vcf === 'string' ? stringToStream(vcf) : (vcf as NodeJS.ReadableStream);

		let parser: VCF;
		const header: string[] = [];
		const outputs: Either<Variant & AnnotationData, Variant>[] = [];
		const errors: Error[] = [];

		let done = false;
		let resolve: () => void;
		let promise: Promise<void> = new Promise((r) => (resolve = r));

		const _this = this;

		const rl = readline.createInterface({ input: vcfStream });
		rl.on('line', function (line): void {
			try {
				if (line.startsWith('#')) {
					header.push(line);
					return;
				}
				if (parser === undefined) {
					parser = new VCF({ header: header.join('\n') });
				}

				const variant = Variant.parse(parser.parseLine(line));

				const annotatedVariant = _this.annotation
					? _this.annotation({ variant, parser })
					: success(variant as Variant & AnnotationData);

				outputs.push(annotatedVariant);
				resolve();
				promise = new Promise((r) => (resolve = r));
			} catch (e) {
				if (e instanceof Error) {
					errors.push(e);
				} else if (typeof e === 'string') {
					errors.push(new Error(e));
				} else {
					errors.push(new Error(`Unknown Error Occurred - ${e}`));
				}
			}
		});

		rl.on('close', function () {
			if (!parser) {
				done = true;
				errors.push(new Error('Unable to parse VCF - no content.'));
			} else {
				done = true;
			}
			resolve();
		});

		while (!done) {
			await promise;
			if (errors.length) {
				console.log(errors);
				throw errors[0];
			}
			while (outputs.length) {
				const variant = outputs.shift();
				if (variant) {
					yield variant;
				}
			}
		}
	}
}

export default VcfExtractor;
