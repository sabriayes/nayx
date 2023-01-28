import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalAuthService } from '@nayx/core/abstracts';
import { HttpClient } from '@angular/common/http';

@Component({
	selector: 'app-sing-in-page',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './sing-in-page.component.html',
	styleUrls: ['./sing-in-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingInPageComponent {
	http = inject(HttpClient);
	authService = inject(LocalAuthService);

	constructor() {
		this.authService
			.signIn({
				type: 'email',
				email: 'berkay@naylalabs.com',
				password: 'Ucr7tp55*',
			})
			.subscribe(() => {
				this.authService.verifyAccount().subscribe(console.log);
				this.http
					.get(
						'https://dev-api-sales-sense-backend.naylalabs.xyz/auth',
					)
					.subscribe(console.log);
			});
	}
}
