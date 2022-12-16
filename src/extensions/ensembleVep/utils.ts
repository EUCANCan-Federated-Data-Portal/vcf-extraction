import { safeParseFloat } from '../../utils/stringUtils';

export const parseImpactScoreString = (value?: string): { impact?: string; score?: number } => {
	const regex = /([\w]+)\((-?[0-9]+(\.[0-9]*)?)\)/;
	const groups = { impact: 1, score: 2 };

	if (!value) {
		return {};
	}
	const matches = regex.exec(value);
	return matches ? { impact: matches[groups.impact], score: safeParseFloat(matches[groups.score]) } : {};
};

export const isNotEmpty = (value: string): boolean => !!value || value !== '';
