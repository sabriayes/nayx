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
	Observable,
	retry,
	Subject,
	tap,
	throwError,
} from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import CredentialResponse = google.accounts.id.CredentialResponse;

const PROVIDER_ID = 'NAXYGOOGLE';
const API_URL = 'https://accounts.google.com/gsi/client';

@Injectable()
export class GoogleAuthenticationService<A, R extends BasicAuthResponse>
	extends BaseSocialAuthenticationService<A, GoogleAuthServiceOptions>
	implements GoogleAuthService<A, R>, OnDestroy
{
	public init$ = new Subject<null>();
	public in$ = new BehaviorSubject<R | null>(null);
	public out$ = new BehaviorSubject(null);
	public error$ = new BehaviorSubject<Error | null>(null);
	public override readonly options = inject<GoogleAuthServiceOptions>(
		GOOGLE_AUTH_SERVICE_OPTIONS,
	);

	constructor() {
		super();
		const document = inject(DOCUMENT);
		this.appendScript(document, PROVIDER_ID, API_URL).then(
			this.initProvider.bind(this),
		);
	}

	ngOnDestroy() {
		this.init$.complete();
		this.in$.complete();
		this.out$.complete();
		this.error$.complete();
		this.account$.complete();
	}

	private initProvider() {
		try {
			google.accounts.id.initialize({
				client_id: this.options.id || '',
				auto_select: false,
				itp_support: false,
				callback: this.handleProviderCallback.bind(this),
			});
		} catch (error) {
			if (error instanceof Error) {
				this.error$.next(error);
			}
		} finally {
			this.init$.next(null);
		}
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
		this.out$.next(null);
		return super.signOut();
	}

	signIn(idToken: string): Observable<R> {
		const { retryLimit } = this.options;

		return this.http
			.post<R>(
				this.getEndpoint(AuthEndpoint.SIGN_IN),
				{ idToken },
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
