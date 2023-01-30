/// <reference types="google.accounts" />

import { inject, Injectable, OnDestroy } from '@angular/core';
import {
	BasicAuthResponse,
	BaseSocialAuthenticationService,
	GoogleAuthService,
	AuthEndpoint,
	AuthToken,
} from '@nayx/core/index';
import {
	GOOGLE_AUTH_SERVICE_OPTIONS,
	GoogleAuthServiceOptions,
} from './options';
import {
	BehaviorSubject,
	catchError,
	finalize,
	first,
	map,
	Observable,
	retry,
	tap,
	throwError,
} from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import CredentialResponse = google.accounts.id.CredentialResponse;

const PROVIDER_ID = 'NAXYGOOGLE';
const API_URL = 'https://accounts.google.com/gsi/client';

@Injectable()
export class GoogleAuthenticationService<A, R extends BasicAuthResponse>
	extends BaseSocialAuthenticationService<A, GoogleAuthServiceOptions>
	implements GoogleAuthService<A, R>, OnDestroy
{
	public init$ = new BehaviorSubject<boolean>(false);
	public in$ = new BehaviorSubject<R | void>(undefined);
	public out$ = new BehaviorSubject<void>(undefined);
	public error$ = new BehaviorSubject<Error | void>(undefined);
	public override readonly options = inject<GoogleAuthServiceOptions>(
		GOOGLE_AUTH_SERVICE_OPTIONS,
	);

	constructor() {
		super();
		this.appendScript(PROVIDER_ID, API_URL)
			.pipe(
				first(),
				finalize(this.init$.complete),
				map(() =>
					google.accounts.id.initialize({
						callback: this.handleProviderCallback.bind(this),
						client_id: this.options.id ?? '',
						auto_select: false,
						itp_support: false,
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

	private handleProviderCallback({ credential }: CredentialResponse) {
		this.signIn(credential).subscribe({
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
