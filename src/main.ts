import { bootstrapApplication } from '@angular/platform-browser';
import { DATE_PIPE_DEFAULT_OPTIONS } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppComponent } from '@app/app.component';
import { AuthToken } from '@nayx/core/enums';
import { AUTH_TOKENS_SERVICE_OPTIONS } from '@nayx/auth-tokens';
import { provideNaxyLocalAuth } from '@nayx/local-auth';
import { authInterceptor } from '@nayx/auth-interceptor';
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
		provideNaxyLocalAuth({
			baseURL: 'https://dev-api-sales-sense-backend.naylalabs.xyz',
		}),
	],
});
