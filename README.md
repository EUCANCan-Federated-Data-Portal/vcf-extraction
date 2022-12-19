# VCF Extractor
TypeScript utility to safely parse a VCF file into an array of clearly typed TS objects. 

This library leans heavily on the VCF parsing work of [GMOD's VCF library](https://www.npmjs.com/package/@gmod/vcf), wrapped to accept files as strings or JS Streams. 

Additionally, this parser adds the ability to provide a custom extension function that will enrich the returned Variant data, for instance to parse annotation data provided in the VCF file. Included in this package is an extension to parse Ensemble VEP annotation data for each variant.

## Dependencies

* Node 18+
* TypeScript 4.9+
## Usage Example

> Note: Not currently published to npm, but **will** be once stabilized a bit. Until then, to import this into another project you will need to clone this repository and use npm-link

### Default VCF Extractor

Standard VCF data extraction only, no annotation processing.

```ts
import VcfExtractor from 'vcf-extractor';

async function example(processVariant: (v: Varaint) => any): void {

	// Initialize Extractor with no annotation extension
	const extractor = new VcfExtractor();
	
	// Example call to a method elsewhere in your application that will
	// fetch a VCF file, either as a ReadableStream or a String
	const vcf = await fetchVcf(); 
	
	// Iterate through all variants in stream
	for await (const variant of extractor.streamVariants(vcf)) {
		// Process each variant from the VCF, one at a time
		processVariant(variant);
	}
}
```

### Extended VCF Extractor with EnsembleVEP Annotations

This library has one built in Extension available out of the box, with the potential to add more later. This extension will parse EnsembleVEP annotations and add these to the returned Variant object.

The annotation data is typed as defined by `VcfExtensions.EnsembleVepTypes.EnsembleVepAnnotation`, and when this extensionis used, the extracted variants will have the interseciton type `Varaint & VcfExtensions.EnsembleVepTypes.EnsembleVepAnnotation`;

To use this extension, initialize the extractor with the extension provided:

```ts
import VcfExtractor, { VcfExtensions } from 'vcf-extractor';
const extractor = new VcfExtractor(VcfExtensions.ensembleVepParser);
```

A full example extracting variants this way and then passing them to another externally defined processor:

```ts
import VcfExtractor, { VcfExtensions } from 'vcf-extractor';

type AnnotatedVariant = Varaint & VcfExtensions.EnsembleVepTypes.EnsembleVepAnnotation;

async function example(processVariant: (v: AnnotatedVariant) => any): void {

	// Initialize Extractor with no annotation extension
	const extractor = new VcfExtractor(VcfExtensions.ensembleVepParser);
	
	// Example call to a method elsewhere in your application that will
	// return the entire contents of a VCF file transformed into a string
	const vcfAsString: String = getVcf(); 
	
	// Iterate through all variants in stream
	for await (const variant of extractor.generateVariants(vcfStream)) {
		// Process each variant from the VCF, one at a time
		processVariant(variant);
	}
}
```


## Custom Extensions

To extend the `VcfExtractor` to return annotated data that is not supported in this library, you can pass a custom method to the extractor. To do this, you will need to declare a new function that matches the `AnnotationExtension` type signature:

```ts
type AnnotationExtension<AnnotationData> = (data: {
	variant: Variant;
	parser: VCF;
}) => Either<Variant & AnnotationData, Variant>;
```

In this definition `AnnotationData` is the structure of the annotation data that will be added to the Variant objects returned by the `VcfExtractor`.

This function takes a data object that contains the variant to be parsed, and the VCF parser that contains all the VCF file header information.

The method will return a modified object that contains all the properties of the original Variant, plus the properties required by the `AnnotationData` type you declared. This return must be wrapped in a [`Either<A,B>`](./src/types.ts) type. This can be created using the exported convenience methods [`success(value: A)`](./src/types.ts) or [`fallback(value:B, message:String)`](./src/types.ts).

You can review, as an example any of the extensions contained in this library: [/src/extensions](./src/extensions/).

As a quick guide, here is an example extension:

```ts
import { AnnotationExtension, success, fallback } from 'vcf-extractor';

export type ExampleAnnotation = {
	extension: {
		example_data: string;
	};
};

const exampleExtension: AnnotationExtension<ExampleAnnotation> = (data) => {
	const { variant, parser } = data;

	// Some relevant check against the VCF Header
	if (parser.getMetadata('HEADER_NAME', 'EXAMPLE_PROPERTY') === undefined) {
		return fallback(variant, 'VCF does not support ExampleAnnotation');
	}

	const annotationData = { extension: { example_data: variant.CHROM } };

	const output = Object.assign({}, variant, annotationData);

	return success(output);
};

export default exampleExtension;
```