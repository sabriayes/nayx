import { InjectionToken } from '@angular/core';
import { AuthEndpoint } from '@nayx/core/enums';
import { AuthServiceOptions } from '@nayx/core/models';

export type LocalAuthServiceOptions = AuthServiceOptions;

export const LOCAL_AUTH_SERVICE_DEFAULT_OPTIONS: LocalAuthServiceOptions = {
	retryLimit: 1,
	baseURL: 'http://localhost',
	endpoints: {
		[AuthEndpoint.SIGN_IN]: 'auth', // METHOD: POST
		[AuthEndpoint.SIGN_OUT]: 'auth', // METHOD: DELETE
		[AuthEndpoint.VERIFY_ACCOUNT]: 'auth', // METHOD: GET
	},
};

export const LOCAL_AUTH_SERVICE_OPTIONS: InjectionToken<LocalAuthServiceOptions> =
	new InjectionToken('LOCAL_AUTH_SERVICE_OPTIONS', {
		providedIn: 'root',
		factory: () => LOCAL_AUTH_SERVICE_DEFAULT_OPTIONS,
	});
