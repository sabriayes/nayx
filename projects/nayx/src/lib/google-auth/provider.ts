import { makeEnvironmentProviders } from '@angular/core';
import {
	GoogleAuthService,
	StorageService,
	TokensService,
} from '@nayx/core/index';
import { AuthenticationTokensService } from '@nayx/auth-tokens';
import { LocalStorageService } from '@nayx/local-storage';
import {
	GOOGLE_AUTH_SERVICE_DEFAULT_OPTIONS,
	GOOGLE_AUTH_SERVICE_OPTIONS,
	GoogleAuthServiceOptions,
} from '@nayx/google-auth/options';
import { GoogleAuthenticationService } from '@nayx/google-auth/google-auth.service';

export const provideNayxGoogleAuth = (
	options?: Partial<GoogleAuthServiceOptions>,
) =>
	makeEnvironmentProviders([
		{
			provide: GOOGLE_AUTH_SERVICE_OPTIONS,
			useValue: Object.assign(
				GOOGLE_AUTH_SERVICE_DEFAULT_OPTIONS,
				options,
			),
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
			provide: GoogleAuthService,
			useClass: GoogleAuthenticationService,
		},
	]);
