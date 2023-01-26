import { InjectionToken } from '@angular/core';
import { AuthEndpoint } from '@nayx/core/enums';
import { AuthServiceOptions } from '@nayx/core/models';

export type OTPAuthServiceOptions = AuthServiceOptions;

export const OTP_AUTH_SERVICE_DEFAULT_OPTIONS: () => OTPAuthServiceOptions =
	() => ({
		retryLimit: 1,
		baseURL: 'http://localhost',
		endpoints: {
			[AuthEndpoint.SIGN_IN]: 'auth', // METHOD: POST
			[AuthEndpoint.SIGN_OUT]: 'auth', // METHOD: DELETE
			[AuthEndpoint.VERIFY_ACCOUNT]: 'auth', // METHOD: GET
			[AuthEndpoint.VERIFY_OTP]: 'auth/otp', // METHOD: POST
		},
	});

export const OTP_AUTH_SERVICE_OPTIONS: InjectionToken<OTPAuthServiceOptions> =
	new InjectionToken('OTP_AUTH_SERVICE_OPTIONS', {
		providedIn: 'root',
		factory: OTP_AUTH_SERVICE_DEFAULT_OPTIONS,
	});
