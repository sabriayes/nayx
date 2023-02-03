import { Route } from '@angular/router';
import { SignInPageComponent } from '@app/pages/auth/sign-in-page/sign-in-page.component';
import { AccessDeniedPageComponent } from '@app/pages/auth/access-denied-page/access-denied-page.component';
import { permissionEveryGuard } from '@nayx/permissions';

export const ROUTES: Route[] = [
	{
		path: 'auth',
		component: SignInPageComponent,
	},
	{
		path: 'dashboard',
		component: SignInPageComponent,
		canActivate: [permissionEveryGuard('dashboard')],
	},
	{
		path: 'access-denied',
		component: AccessDeniedPageComponent,
	},
];
