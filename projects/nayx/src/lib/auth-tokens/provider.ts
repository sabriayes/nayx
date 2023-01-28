import { makeEnvironmentProviders } from '@angular/core';
import { TokensService } from '@nayx/core/abstracts';
import { AuthenticationTokensService } from '@nayx/auth-tokens/auth-tokens.service';
import {
	AUTH_TOKENS_SERVICE_DEFAULT_OPTIONS,
	AUTH_TOKENS_SERVICE_OPTIONS,
	AuthenticationTokensServiceOptions,
} from '@nayx/auth-tokens/options';

export const provideNayxAuthTokens = (
	options?: Partial<AuthenticationTokensServiceOptions>,
) =>
	makeEnvironmentProviders([
		{
			provide: AUTH_TOKENS_SERVICE_OPTIONS,
			useValue: Object.assign(
				AUTH_TOKENS_SERVICE_DEFAULT_OPTIONS,
				options,
			),
		},
		{
			provide: TokensService,
			useClass: AuthenticationTokensService,
		},
	]);
