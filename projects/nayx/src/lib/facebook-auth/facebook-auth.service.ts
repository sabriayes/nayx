/// <reference types="facebook-js-sdk" />

import { inject, Injectable, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { filter, finalize, first, map, Observable, switchMap, tap } from 'rxjs';
import {
	BasicAuthResponse,
	BaseSocialAuthenticationService,
	FacebookAuthService,
} from '@nayx/core/index';
import {
	FacebookAuthServiceOptions,
	FACEBOOK_AUTH_SERVICE_OPTIONS,
} from './options';

import StatusResponse = facebook.StatusResponse;

const PROVIDER_ID = 'NAXYFACEBOOK';
const API_URL = 'https://connect.facebook.net/%LOCALE%/sdk.js';

@Injectable()
export class FacebookAuthenticationService<A, R extends BasicAuthResponse>
	extends BaseSocialAuthenticationService<A, R, FacebookAuthServiceOptions>
	implements FacebookAuthService<A, R>, OnDestroy
{
	public override readonly options = inject<FacebookAuthServiceOptions>(
		FACEBOOK_AUTH_SERVICE_OPTIONS,
	);

	constructor() {
		super();

		const { id, locale, version } = this.options;
		this.appendScript(PROVIDER_ID, API_URL.replace('%LOCALE%', locale))
			.pipe(
				first(),
				finalize(() => this.init$.complete()),
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
		this.in$.complete();
		this.completeSubjects();
	}

	emitSignIn() {
		return new Observable<StatusResponse>((observer) =>
			FB.login((response) => observer.next(response)),
		)
			.pipe(
				filter(({ status }) => status === 'connected'),
				tap(() => this.pending$.next(true)),
				switchMap(({ authResponse }) =>
					this.signIn(authResponse.accessToken),
				),
				finalize(() => this.pending$.next(false)),
			)
			.subscribe({
				next: (response: R) => {
					this.in$.next(response);
				},
				error: (error: HttpErrorResponse) => this.error$.next(error),
			});
	}

	override signOut(): Observable<never> {
		return new Observable<never>((observer) => {
			FB.logout(() => observer.next());
		}).pipe(
			tap(() => this.pending$.next(true)),
			tap(() => this.out$.next()),
			switchMap(() => super.signOut()),
			finalize(() => this.pending$.next(false)),
		);
	}
}
