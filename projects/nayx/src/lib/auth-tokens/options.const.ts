import { InjectionToken } from '@angular/core';
import { AuthToken } from '@nayx/core/enums';
import { AuthenticationTokensServiceOptions } from '@nayx/auth-tokens/options.interface';

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
