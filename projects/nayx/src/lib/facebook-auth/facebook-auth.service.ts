/// <reference types="facebook-js-sdk" />

import { inject, Injectable, OnDestroy } from '@angular/core';
import {
	BasicAuthResponse,
	BaseSocialAuthenticationService,
	AuthEndpoint,
	AuthToken,
	FacebookAuthService,
} from '@nayx/core/index';
import {
	FacebookAuthServiceOptions,
	FACEBOOK_AUTH_SERVICE_OPTIONS,
} from './options';
import {
	BehaviorSubject,
	catchError,
	filter,
	finalize,
	first,
	map,
	Observable,
	retry,
	switchMap,
	tap,
	throwError,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import StatusResponse = facebook.StatusResponse;

const PROVIDER_ID = 'NAXYFACEBOOK';
const API_URL = 'https://connect.facebook.net/%LOCALE%/sdk.js';

@Injectable()
export class FacebookAuthenticationService<A, R extends BasicAuthResponse>
	extends BaseSocialAuthenticationService<A, FacebookAuthServiceOptions>
	implements FacebookAuthService<A, R>, OnDestroy
{
	public init$ = new BehaviorSubject<boolean>(false);
	public in$ = new BehaviorSubject<R | void>(undefined);
	public out$ = new BehaviorSubject<void>(undefined);
	public error$ = new BehaviorSubject<Error | void>(undefined);
	public override readonly options = inject<FacebookAuthServiceOptions>(
		FACEBOOK_AUTH_SERVICE_OPTIONS,
	);

	constructor() {
		super();

		const { id, locale, version } = this.options;
		this.appendScript(PROVIDER_ID, API_URL.replace('%LOCALE%', locale))
			.pipe(
				first(),
				finalize(this.init$.complete),
				map(() =>
					FB.init({
						appId: id ?? '',
						version: version,
						autoLogAppEvents: true,
						cookie: true,
						xfbml: true,
					}),
				),
			)
			.subscribe({
				next: () => this.init$.next(true),
				error: (error) => this.error$.next(error),
			});
	}

	ngOnDestroy() {
		this.init$.complete();
		this.in$.complete();
		this.out$.complete();
		this.error$.complete();
		this.account$.complete();
	}

	emitSignIn() {
		return new Observable<StatusResponse>((observer) =>
			FB.login((response) => observer.next(response)),
		)
			.pipe(
				filter(({ status }) => status === 'connected'),
				switchMap(({ authResponse }) => {
					return this.signIn(authResponse.accessToken);
				}),
			)
			.subscribe({
				next: (response: R) => {
					this.in$.next(response);
				},
				error: (error: HttpErrorResponse) => this.error$.next(error),
			});
	}

	override signOut(): Observable<never> {
		google.accounts.id.disableAutoSelect();
		this.out$.next();
		return super.signOut();
	}

	signIn(authToken: string): Observable<R> {
		const { retryLimit } = this.options;

		return this.http
			.post<R>(
				this.getEndpoint(AuthEndpoint.SIGN_IN),
				{ authToken },
				{ context: this.context },
			)
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
}
