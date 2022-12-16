import VCF from '@gmod/vcf';
import readline from 'readline';
import { Readable } from 'stream';

import { twoVariantVcf } from '../data/vcf';

export const createParser = async (vcf: string): Promise<VCF> => {
	const stream = new Readable();
	stream.push(vcf);
	stream.push(null); // end stream
	const header: string[] = [];

	let done = false;

	return new Promise((resolve) => {
		const rl = readline.createInterface({ input: stream });
		rl.on('line', function (line): void {
			if (line.startsWith('#')) {
				header.push(line);
				return;
			}
			if (!done) {
				done = true;
				resolve(new VCF({ header: header.join('\n') }));
			}
		});
	});
};

export const parsers = {
	annotated: {
		ensembleVep: createParser(twoVariantVcf),
	},
};
