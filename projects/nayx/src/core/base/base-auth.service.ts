import { inject, Injectable } from '@angular/core';
import {
	HttpClient,
	HttpContext,
	HttpErrorResponse,
} from '@angular/common/http';
import {
	AuthService,
	ConfigurableAuthService,
	TokensService,
	AuthServiceOptions,
	AuthEndpoint,
	AuthToken,
} from '@nayx/core/index';
import {
	BehaviorSubject,
	catchError,
	iif,
	Observable,
	of,
	retry,
	switchMap,
	tap,
	throwError,
} from 'rxjs';
import { IS_INTERCEPTORS_ENABLED } from '@nayx/contexts';

@Injectable()
export class BaseAuthenticationService<A, Options extends AuthServiceOptions>
	implements AuthService<A>, ConfigurableAuthService<Options>
{
	readonly options!: Options;
	readonly tokens = inject(TokensService);
	readonly http = inject(HttpClient);

	readonly $account = new BehaviorSubject<A | undefined>(undefined);
	readonly context: HttpContext = new HttpContext().set(
		IS_INTERCEPTORS_ENABLED,
		true,
	);

	hasEndpoint(endpoint: AuthEndpoint): boolean {
		return !!this.options.endpoints[endpoint];
	}

	getEndpoint(endpoint: AuthEndpoint): string {
		return `${this.options.baseURL}/${this.options.endpoints[endpoint]}`;
	}

	getAccount(): Observable<A | undefined> {
		return this.$account.asObservable();
	}

	verifyAccount(): Observable<A | HttpErrorResponse> {
		const { retryLimit } = this.options;
		return this.http
			.get<A>(this.getEndpoint(AuthEndpoint.VERIFY_ACCOUNT), {
				context: this.context,
			})
			.pipe(
				retry(retryLimit),
				tap((account: A) => this.$account.next(account)),
				catchError((err) => {
					return throwError(() => err);
				}),
			);
	}

	isAuth(): Observable<boolean> {
		return of(!!this.tokens.get(AuthToken.ACCESS_TOKEN));
	}

	signOut(): Observable<never> {
		this.tokens.clear();
		this.$account.next(undefined);

		const hasSignOut = (): boolean =>
			!!this.options.endpoints[AuthEndpoint.SIGN_OUT];

		return iif(
			hasSignOut,
			this.http
				.delete(this.getEndpoint(AuthEndpoint.SIGN_OUT), {
					context: this.context,
				})
				.pipe(switchMap(() => of())),
			of(),
		);
	}
}
