import { bootstrapApplication } from '@angular/platform-browser';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from '@app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AuthEndpoint, AuthToken } from '@nayx/core/enums';
import { LocalAuthenticationModule } from '@nayx/local-auth/local-auth.module';
import {
	AUTH_TOKENS_SERVICE_OPTIONS,
	AuthTokensModule,
} from '@nayx/auth-tokens';
import { LOCAL_AUTH_SERVICE_OPTIONS } from '@nayx/local-auth';
import { LocalStorageModule } from '@nayx/local-storage';
import { authInterceptor } from '@nayx/auth-interceptor';
import { OTPAuthenticationModule } from '@nayx/otp-auth';
import { provideRouter } from '@angular/router';
import { ROUTES } from './routes';

bootstrapApplication(AppComponent, {
	providers: [
		provideRouter(ROUTES),
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
				baseURL: 'https://dev-api-sales-sense-backend.naylalabs.xyz',
				endpoints: {
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
			OTPAuthenticationModule,
		),
	],
});
