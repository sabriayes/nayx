import { AuthEndpoint } from '@naylalabs/core/enums';

export type AuthServiceOptions = Readonly<{
	retryLimit: number;
	baseURL: `http://${string}` | `https://${string}`;
	endpoints: Partial<Readonly<Record<AuthEndpoint, string>>>;
}>;
