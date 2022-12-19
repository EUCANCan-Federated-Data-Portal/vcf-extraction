import { Readable } from 'stream';

/**
 * Return undefined in place of an empty string, otherwise the original value
 * @param value
 * @returns
 */
export const emptyToUndefined = (value?: string): string | undefined => (value === '' ? undefined : value);

/**
 * Parse string to int, protecting against weird formatting that the JS default accepts
 * undefined is returned for all unusual cases
 * @param value
 * @returns
 */
export const safeParseInt = (value?: string): number | undefined => {
	if (value === undefined) {
		return undefined;
	}

	if (!value.trim().match(/^-?[0-9]+(\.[0]*)?$/)) {
		return undefined;
	}

	const num = parseInt(value);
	return num;
};

/**
 * Parse string to float, protecting against weird formatting that the JS default accepts
 * undefined is returned for all unusual cases
 * @param value
 * @returns
 */
export const safeParseFloat = (value?: string): number | undefined => {
	if (value === undefined || value === '') {
		return undefined;
	}

	if (!value.trim().match(/^-?[0-9]*(\.[0-9]*)?(E-?[0-9]*)?$/)) {
		return undefined;
	}

	const num = parseFloat(value);
	return num;
};

export const stringToStream = (vcf: string): NodeJS.ReadableStream => {
	const stream = new Readable();
	stream.push(vcf);
	stream.push(null); // end stream
	return stream;
};
