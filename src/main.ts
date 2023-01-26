import { bootstrapApplication } from '@angular/platform-browser';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from '@app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AuthEndpoint, AuthToken } from '@naylalabs/core/enums';
import { LocalAuthenticationModule } from '@naylalabs/local-auth/local-auth.module';
import {
	AUTH_TOKENS_SERVICE_OPTIONS,
	AuthTokensModule,
} from '@naylalabs/auth-tokens';
import { LOCAL_AUTH_SERVICE_OPTIONS } from '@naylalabs/local-auth';
import { LocalStorageModule } from '@naylalabs/local-storage';
import { authInterceptor } from '@naylalabs/auth-interceptor';

bootstrapApplication(AppComponent, {
	providers: [
		provideAnimations(),
		provideHttpClient(withInterceptors([authInterceptor])),
		{
			provide: DATE_PIPE_DEFAULT_OPTIONS,
			useValue: {
				dateFormat: 'mediumDate',
			},
		},
		{
			provide: AUTH_TOKENS_SERVICE_OPTIONS,
			useValue: {
				keys: {
					[AuthToken.ACCESS_TOKEN]: 'accessToken',
					[AuthToken.REFRESH_TOKEN]: 'refreshToken',
				},
			},
		},
		{
			provide: LOCAL_AUTH_SERVICE_OPTIONS,
			useValue: {
				retryLimit: 1,
				baseURL: 'https://api.sabriayes.com/',
				endpoins: {
					[AuthEndpoint.SIGN_IN]: 'auth', // METHOD: POST
					[AuthEndpoint.SIGN_OUT]: 'auth', // METHOD: DELETE
					[AuthEndpoint.VERIFY_ACCOUNT]: 'auth', // METHOD: GET
				},
			},
		},
		importProvidersFrom(
			LocalStorageModule,
			AuthTokensModule,
			LocalAuthenticationModule,
		),
	],
});
