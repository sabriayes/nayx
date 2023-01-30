import { bootstrapApplication } from '@angular/platform-browser';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from '@app/app.component';
import { AuthEndpoint, AuthToken } from '@nayx/core/enums';
import { AUTH_TOKENS_SERVICE_OPTIONS } from '@nayx/auth-tokens';
import { provideNaxyLocalAuth } from '@nayx/local-auth';
import { authInterceptor } from '@nayx/auth-interceptor';
import { provideRouter } from '@angular/router';
import { ROUTES } from './routes';
import { AuthServiceOptions } from '@nayx/core/models';
import { provideNaxyGoogleAuth } from '@nayx/google-auth';
import { provideNaxyFacebookAuth } from '@nayx/facebook-auth';

const AUTH_OPTIONS: AuthServiceOptions = {
	retryLimit: 1,
	baseURL: 'https://dev-api-sales-sense-backend.naylalabs.xyz',
	endpoints: {
		[AuthEndpoint.SIGN_IN]: 'auth',
		[AuthEndpoint.SIGN_OUT]: 'auth',
		[AuthEndpoint.VERIFY_ACCOUNT]: 'auth',
	},
};

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
					[AuthToken.ACCESS_TOKEN]: 'access_token',
					[AuthToken.REFRESH_TOKEN]: 'refresh_token',
				},
			},
		},
		provideNaxyLocalAuth(AUTH_OPTIONS),
		provideNaxyGoogleAuth({
			...AUTH_OPTIONS,
			id: '898348565692-bm1hgvrjcovmc7lnja8jdb4c9vced99m.apps.googleusercontent.com',
			scopes: ['email', 'profile'],
			endpoints: {
				...AUTH_OPTIONS.endpoints,
				[AuthEndpoint.SIGN_IN]: 'auth/google',
			},
		}),
		provideNaxyFacebookAuth({
			...AUTH_OPTIONS,
			id: '722905828672583',
			scopes: ['email'],
		}),
	],
});
