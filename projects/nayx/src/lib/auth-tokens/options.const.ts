import { InjectionToken } from '@angular/core';
import { AuthToken, TokensServiceOptions } from '@nayx/core/index';

export type AuthenticationTokensServiceOptions = TokensServiceOptions;

export const AUTH_TOKENS_SERVICE_DEFAULT_OPTIONS: () => AuthenticationTokensServiceOptions =
	() => ({
		keys: {
			[AuthToken.ACCESS_TOKEN]: 'accessToken',
			[AuthToken.REFRESH_TOKEN]: 'refreshToken',
		},
	});

export const AUTH_TOKENS_SERVICE_OPTIONS: InjectionToken<AuthenticationTokensServiceOptions> =
	new InjectionToken('NAUTH_TOKENS_SERVICE_OPTIONS', {
		providedIn: 'root',
		factory: AUTH_TOKENS_SERVICE_DEFAULT_OPTIONS,
	});
