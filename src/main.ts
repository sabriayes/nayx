import { bootstrapApplication } from '@angular/platform-browser';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from '@app/app.component';
import { AuthEndpoint, AuthToken } from '@nayx/core/enums';
import { AUTH_TOKENS_SERVICE_OPTIONS } from '@nayx/auth-tokens';
import { provideNayxLocalAuth } from '@nayx/local-auth';
import { authInterceptor } from '@nayx/auth-interceptor';
import { provideRouter } from '@angular/router';
import { ROUTES } from './routes';
import { AuthServiceOptions } from '@nayx/core/models';
import { provideNayxGoogleAuth } from '@nayx/google-auth';
import { provideNayxFacebookAuth } from '@nayx/facebook-auth';
import { provideNayxPermissions } from '@nayx/permissions';
import { APP_INITIALIZER, inject } from '@angular/core';
import { PermissionsService } from '@nayx/core/abstracts';

const AUTH_OPTIONS: AuthServiceOptions = {
	retryLimit: 1,
	baseURL: 'https://api.backend.com',
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
		provideNayxPermissions({
			redirectTo: ['/access-denied'],
		}),
		provideNayxLocalAuth(AUTH_OPTIONS),
		provideNayxGoogleAuth({
			...AUTH_OPTIONS,
			id: 'GOOGLE_CLIENT_ID',
			scopes: ['email', 'profile'],
			endpoints: {
				...AUTH_OPTIONS.endpoints,
				[AuthEndpoint.SIGN_IN]: 'auth/google',
			},
		}),
		provideNayxFacebookAuth({
			...AUTH_OPTIONS,
			id: 'FACEBOOK_APP_Id',
			scopes: ['email'],
		}),
		{
			provide: APP_INITIALIZER,
			useFactory: () => {
				const service = inject(PermissionsService);
				return () =>
					service.import([
						{
							scope: 'dashboard',
							grants: { hasAccess: true, hasRead: true },
						},
					]);
			},
			multi: true,
			deps: [PermissionsService],
		},
	],
});
