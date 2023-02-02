import { makeEnvironmentProviders } from '@angular/core';
import {
	FacebookAuthService,
	StorageService,
	TokensService,
} from '@nayx/core/index';
import { AuthenticationTokensService } from '@nayx/auth-tokens';
import { LocalStorageService } from '@nayx/local-storage';
import {
	FACEBOOK_AUTH_SERVICE_DEFAULT_OPTIONS,
	FACEBOOK_AUTH_SERVICE_OPTIONS,
	FacebookAuthServiceOptions,
} from '@nayx/facebook-auth/options';
import { FacebookAuthenticationService } from '@nayx/facebook-auth/facebook-auth.service';

export const provideNayxFacebookAuth = (
	options?: Partial<FacebookAuthServiceOptions>,
) =>
	makeEnvironmentProviders([
		{
			provide: FACEBOOK_AUTH_SERVICE_OPTIONS,
			useValue: Object.assign(
				FACEBOOK_AUTH_SERVICE_DEFAULT_OPTIONS,
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
			provide: FacebookAuthService,
			useClass: FacebookAuthenticationService,
		},
	]);
