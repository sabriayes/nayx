import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoogleSigninButtonDirective } from '@nayx/google-auth';
import { AuthFacadeService } from '@app/services/auth-facade.service';

@Component({
	selector: 'app-sign-in-page',
	standalone: true,
	templateUrl: './sign-in-page.component.html',
	styleUrls: ['./sign-in-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [GoogleSigninButtonDirective],
})
export class SignInPageComponent {
	public readonly authFacade = inject(AuthFacadeService);

	constructor() {
		this.authFacade.isLoading$.subscribe(console.log);
	}

	public signInWithLocal() {
		this.authFacade
			.signInWithLocal('user@naylalabs.com', 'PassWorD2023*')
			.subscribe(() => {
				console.log('Succeeded!');
			});
	}

	public signInWithFacebook() {
		this.authFacade.signInWithFacebook();
	}
}
