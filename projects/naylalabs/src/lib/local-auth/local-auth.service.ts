import { inject, Injectable } from '@angular/core';
import {
	HttpClient,
	HttpContext,
	HttpErrorResponse,
} from '@angular/common/http';
import {
	ConfigurableAuthService,
	LocalAuthService,
} from '@naylalabs/core/abstracts/auth-service';
import { SigninCredentials, BasicAuthResponse } from '@naylalabs/core/models';
import { TokensService } from '@naylalabs/core/abstracts';
import { AuthEndpoint, AuthToken } from '@naylalabs/core/enums';
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
import { IS_INTERCEPTORS_ENABLED } from '@naylalabs/contexts';
import { LocalAuthServiceOptions } from './options.interface';
import { LOCAL_AUTH_SERVICE_OPTIONS } from './options.const';

@Injectable()
export class LocalAuthenticationService<A, R extends BasicAuthResponse>
	extends ConfigurableAuthService<LocalAuthServiceOptions>
	implements
		LocalAuthService<A, R>,
		ConfigurableAuthService<LocalAuthServiceOptions>
{
	public readonly options = inject<LocalAuthServiceOptions>(
		LOCAL_AUTH_SERVICE_OPTIONS,
	);
	private readonly tokens = inject(TokensService);
	private readonly http = inject(HttpClient);

	public $account = new BehaviorSubject<A | undefined>(undefined);

	private context: HttpContext = new HttpContext().set(
		IS_INTERCEPTORS_ENABLED,
		true,
	);

	getAccount(): Observable<A | undefined> {
		return this.$account.asObservable();
	}

	verifyAccount(): Observable<A | HttpErrorResponse> {
		return this.http
			.get<A>(this.getEndpoint(AuthEndpoint.VERIFY_ACCOUNT), {
				context: this.context,
			})
			.pipe(
				retry(1),
				tap((account: A) => this.$account.next(account)),
				catchError((err) => {
					return throwError(() => err);
				}),
			);
	}

	isAuth(): Observable<boolean> {
		return of(!!this.tokens.get(AuthToken.ACCESS_TOKEN));
	}

	signIn(credentials: SigninCredentials): Observable<R> {
		const { retryLimit } = this.options;
		delete credentials._kind;

		return this.http
			.post<R>(this.getEndpoint(AuthEndpoint.SIGN_IN), credentials, {
				context: this.context,
			})
			.pipe(
				retry(retryLimit),
				tap((res) => {
					this.tokens.set(AuthToken.ACCESS_TOKEN, res.accessToken);
					this.tokens.set(AuthToken.REFRESH_TOKEN, res.refreshToken);
				}),
				catchError((err) => {
					return throwError(() => err);
				}),
			);
	}

	signOut(): Observable<never> {
		this.tokens.clear();
		this.$account.next(undefined);

		const hasSignOut = (): boolean =>
			!!this.options.endpoins[AuthEndpoint.SIGN_OUT];

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
