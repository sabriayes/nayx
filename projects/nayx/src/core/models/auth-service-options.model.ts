import { AuthEndpoint } from '@nayx/core/enums';

export type AuthServiceOptions = Readonly<{
	retryLimit: number;
	baseURL: `http://${string}` | `https://${string}`;
	endpoints: Partial<Readonly<Record<AuthEndpoint, string>>>;
}>;

export type SocialAuthServiceOptions = AuthServiceOptions &
	Readonly<{
		id: string | null;
		scopes: string[];
	}>;
