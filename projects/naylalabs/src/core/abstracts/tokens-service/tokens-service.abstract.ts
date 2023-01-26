import { AuthToken } from '@naylalabs/core/enums';

export abstract class TokensService {
	abstract set(type: AuthToken, token: string): void;
	abstract get(type: AuthToken): string | undefined;
	abstract remove(type: AuthToken): void;
	abstract clear(): void;
}
