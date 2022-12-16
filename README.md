# VCF Extractor
TypeScript utility to safely parse a VCF file into an array of clearly typed TS objects. 

This library leans heavily on the VCF parsing work of [GMOD's VCF library](https://www.npmjs.com/package/@gmod/vcf), wrapped to accept files as strings or JS Streams. 

Additionally, this parser adds the ability to provide a custom extension function that will enrich the returned Variant data, for instance to parse annotation data provided in the VCF file. Included in this package is an extension to parse Ensemble VEP annotation data for each variant.

## Usage Example


## Dependencies

Node 18
TypeScript 4.9