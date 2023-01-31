import { Route } from '@angular/router';
import { SignInPageComponent } from '@app/pages/auth/sign-in-page/sign-in-page.component';

export const ROUTES: Route[] = [
	{
		path: 'auth',
		component: SignInPageComponent,
	},
];
