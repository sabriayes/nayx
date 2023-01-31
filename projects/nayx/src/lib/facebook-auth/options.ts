import { InjectionToken } from '@angular/core';
import { AuthEndpoint } from '@nayx/core/enums';
import { SocialAuthServiceOptions } from '@nayx/core/models';

export type FacebookAuthServiceOptions = SocialAuthServiceOptions & {
	locale: `${string}_${string}`;
	version: `v${string}`;
};

export const FACEBOOK_AUTH_SERVICE_DEFAULT_OPTIONS: FacebookAuthServiceOptions =
	{
		id: null,
		scopes: ['email', 'public_profile'],
		locale: 'en_US',
		version: 'v10.0',
		requestKey: 'auth_token',
		retryLimit: 1,
		baseURL: 'http://localhost',
		endpoints: {
			[AuthEndpoint.SIGN_IN]: 'auth', // METHOD: POST
			[AuthEndpoint.SIGN_OUT]: 'auth', // METHOD: DELETE
			[AuthEndpoint.VERIFY_ACCOUNT]: 'auth', // METHOD: GET
		},
	};

export const FACEBOOK_AUTH_SERVICE_OPTIONS: InjectionToken<FacebookAuthServiceOptions> =
	new InjectionToken('FACEBOOK_AUTH_SERVICE_OPTIONS', {
		providedIn: 'root',
		factory: () => FACEBOOK_AUTH_SERVICE_DEFAULT_OPTIONS,
	});
