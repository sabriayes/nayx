import { AuthToken } from '@naylalabs/core/enums';

export type TokensServiceOptions<T extends AuthToken = AuthToken> = {
	readonly keys: Readonly<Record<T, string>>;
};
