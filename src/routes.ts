import { Route } from '@angular/router';
import { SingInPageComponent } from '@app/pages/auth/sing-in-page/sing-in-page.component';

export const ROUTES: Route[] = [
	{
		path: 'auth',
		component: SingInPageComponent,
	},
];
