import { inject, Injectable, NgZone } from '@angular/core';
import {
	merge,
	Observable,
	filter,
	switchMap,
	tap,
	BehaviorSubject,
	finalize,
	of,
} from 'rxjs';
import { Router } from '@angular/router';
import {
	FacebookAuthService,
	GoogleAuthService,
	LocalAuthService,
} from '@nayx/core/entities';
import { User } from '@app/models/user.model';

@Injectable({
	providedIn: 'root',
})
export class AuthFacadeService {
	private readonly zone = inject(NgZone);
	private readonly router = inject(Router);
	private readonly authLocal = inject(LocalAuthService);
	private readonly authGoogle = inject(GoogleAuthService);
	private readonly authFacebook = inject(FacebookAuthService);
	private $isLoading = new BehaviorSubject<boolean>(false);

	private socialIn$ = merge(this.authGoogle.in$, this.authFacebook.in$);
	public isLoading$ = merge(
		this.$isLoading,
		this.authGoogle.pending$,
		this.authFacebook.pending$,
	);

	public verifiedAccount$: Observable<User | undefined> = merge(
		this.authLocal.account$,
		this.authGoogle.account$,
		this.authFacebook.account$,
	).pipe(filter(Boolean));

	private redirectTo = () =>
		this.zone.run(() => this.router.navigate(['/dashboard']));

	constructor() {
		this.socialIn$
			.pipe(
				filter(Boolean),
				switchMap(() => this.authLocal.verifyAccount()),
				finalize(() => this.$isLoading.next(false)),
			)
			.subscribe(() => this.redirectTo());
	}

	signInWithLocal(email: string, password: string): Observable<User> {
		return of(null).pipe(
			tap(() => this.$isLoading.next(true)),
			switchMap(() =>
				this.authLocal.signIn({
					type: 'email',
					email,
					password,
				}),
			),
			finalize(() => this.$isLoading.next(false)),
			tap(() => this.redirectTo()),
		);
	}

	signInWithFacebook() {
		this.authFacebook.emitSignIn();
	}
}
