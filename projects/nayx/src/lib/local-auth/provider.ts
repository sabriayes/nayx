import { makeEnvironmentProviders } from '@angular/core';
import {
	LocalAuthService,
	StorageService,
	TokensService,
} from '@nayx/core/abstracts';
import { AuthenticationTokensService } from '@nayx/auth-tokens';
import { LocalStorageService } from '@nayx/local-storage';
import { LocalAuthenticationService } from '@nayx/local-auth/local-auth.service';
import {
	LOCAL_AUTH_SERVICE_DEFAULT_OPTIONS,
	LOCAL_AUTH_SERVICE_OPTIONS,
	LocalAuthServiceOptions,
} from '@nayx/local-auth/options';

export const provideNaxyLocalAuth = (
	options?: Partial<LocalAuthServiceOptions>,
) =>
	makeEnvironmentProviders([
		{
			provide: LOCAL_AUTH_SERVICE_OPTIONS,
			useValue: Object.assign(
				LOCAL_AUTH_SERVICE_DEFAULT_OPTIONS,
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
			provide: LocalAuthService,
			useClass: LocalAuthenticationService,
		},
	]);
