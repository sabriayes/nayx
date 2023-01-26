import { AuthEndpoint } from '@naylalabs/core/enums';

export type AuthServiceOptions = Readonly<{
	retryLimit: number;
	baseURL: `http://${string}` | `https://${string}`;
	endpoins: Partial<Readonly<Record<AuthEndpoint, string>>>;
}>;
