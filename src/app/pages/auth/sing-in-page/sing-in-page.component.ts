import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleSigninButtonDirective } from '@nayx/google-auth';
import { AuthFacadeService } from '@app/services/auth-facade.service';

@Component({
	selector: 'app-sing-in-page',
	standalone: true,
	templateUrl: './sing-in-page.component.html',
	styleUrls: ['./sing-in-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, GoogleSigninButtonDirective],
})
export class SingInPageComponent {
	public readonly authFacade = inject(AuthFacadeService);

	constructor() {
		this.authFacade.isLoading$.subscribe(console.log);
	}

	public signInWithLocal() {
		this.authFacade
			.signInWithLocal('user@naylalabs.com', 'PassWorD2023*')
			.subscribe(() => {});
	}

	public signInWithFacebook() {
		this.authFacade.signInWithFacebook();
	}
}
