import { InjectionToken } from '@angular/core';
import { AuthEndpoint } from '@nayx/core/enums';
import { SocialAuthServiceOptions } from '@nayx/core/models';

export type GoogleAuthServiceOptions = SocialAuthServiceOptions;

export const GOOGLE_AUTH_SERVICE_DEFAULT_OPTIONS: GoogleAuthServiceOptions = {
	id: null,
	scopes: [],
	retryLimit: 1,
	baseURL: 'http://localhost',
	endpoints: {
		[AuthEndpoint.SIGN_IN]: 'auth', // METHOD: POST
		[AuthEndpoint.SIGN_OUT]: 'auth', // METHOD: DELETE
		[AuthEndpoint.VERIFY_ACCOUNT]: 'auth', // METHOD: GET
	},
};

export const GOOGLE_AUTH_SERVICE_OPTIONS: InjectionToken<GoogleAuthServiceOptions> =
	new InjectionToken('GOOGLE_AUTH_SERVICE_OPTIONS', {
		providedIn: 'root',
		factory: () => GOOGLE_AUTH_SERVICE_DEFAULT_OPTIONS,
	});
