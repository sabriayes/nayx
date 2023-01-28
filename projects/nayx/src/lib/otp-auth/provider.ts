import { makeEnvironmentProviders } from '@angular/core';
import {
	OTPAuthService,
	StorageService,
	TokensService,
} from '@nayx/core/abstracts';
import { AuthenticationTokensService } from '@nayx/auth-tokens';
import { LocalStorageService } from '@nayx/local-storage';
import {
	OTP_AUTH_SERVICE_DEFAULT_OPTIONS,
	OTP_AUTH_SERVICE_OPTIONS,
	OTPAuthServiceOptions,
} from '@nayx/otp-auth/options';
import { OTPAuthenticationService } from '@nayx/otp-auth/otp-auth.service';

export const provideNaxyOTPAuth = (options?: Partial<OTPAuthServiceOptions>) =>
	makeEnvironmentProviders([
		{
			provide: OTP_AUTH_SERVICE_OPTIONS,
			useValue: Object.assign(OTP_AUTH_SERVICE_DEFAULT_OPTIONS, options),
		},
		{
			provide: TokensService,
			useClass: AuthenticationTokensService,
		},
		{
			provide: StorageService,
			useClass: LocalStorageService,
		},
		{
			provide: OTPAuthService,
			useClass: OTPAuthenticationService,
		},
	]);
