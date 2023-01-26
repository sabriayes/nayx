import { InjectionToken } from '@angular/core';
import { TokensServiceOptions } from '@naylalabs/core/models';
import { AuthToken } from '@naylalabs/core/enums';

export const AUTH_TOKENS_SERVICE_DEFAULT_OPTIONS: () => TokensServiceOptions =
	() => ({
		keys: {
			[AuthToken.ACCESS_TOKEN]: 'accessToken',
			[AuthToken.REFRESH_TOKEN]: 'refreshToken',
		},
	});

export const AUTH_TOKENS_SERVICE_OPTIONS: InjectionToken<TokensServiceOptions> =
	new InjectionToken('NAUTH_TOKENS_SERVICE_OPTIONS', {
		providedIn: 'root',
		factory: AUTH_TOKENS_SERVICE_DEFAULT_OPTIONS,
	});
