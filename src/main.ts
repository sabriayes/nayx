import { bootstrapApplication } from '@angular/platform-browser';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
	provideHttpClient,
	withInterceptors,
	withInterceptorsFromDi,
	withRequestsMadeViaParent,
} from '@angular/common/http';
import { AppComponent } from '@app/app.component';
import { importProvidersFrom } from '@angular/core';
import { AuthEndpoint, AuthToken } from '@nayx/core/enums';
import { AUTH_TOKENS_SERVICE_OPTIONS } from '@nayx/auth-tokens';
import { provideLocalAuth } from '@nayx/local-auth';
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
					[AuthToken.ACCESS_TOKEN]: 'access_token',
					[AuthToken.REFRESH_TOKEN]: 'refresh_token',
				},
			},
		},
		provideLocalAuth({
			baseURL: 'https://dev-api-sales-sense-backend.naylalabs.xyz',
		}),
		importProvidersFrom(LocalStorageModule, OTPAuthenticationModule),
	],
});
