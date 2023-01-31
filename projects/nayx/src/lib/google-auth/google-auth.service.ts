/// <reference types="google.accounts" />

import { inject, Injectable, OnDestroy } from '@angular/core';
import { finalize, first, map, Observable, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import {
	BasicAuthResponse,
	BaseSocialAuthenticationService,
	GoogleAuthService,
} from '@nayx/core/index';
import {
	GOOGLE_AUTH_SERVICE_OPTIONS,
	GoogleAuthServiceOptions,
} from './options';
import CredentialResponse = google.accounts.id.CredentialResponse;

const PROVIDER_ID = 'NAXYGOOGLE';
const API_URL = 'https://accounts.google.com/gsi/client';

@Injectable()
export class GoogleAuthenticationService<A, R extends BasicAuthResponse>
	extends BaseSocialAuthenticationService<A, R, GoogleAuthServiceOptions>
	implements GoogleAuthService<A, R>, OnDestroy
{
	public override readonly options = inject<GoogleAuthServiceOptions>(
		GOOGLE_AUTH_SERVICE_OPTIONS,
	);

	constructor() {
		super();
		this.appendScript(PROVIDER_ID, API_URL)
			.pipe(
				first(),
				finalize(() => this.init$.complete()),
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
		this.in$.complete();
		this.completeSubjects();
	}

	private handleProviderCallback({ credential }: CredentialResponse) {
		this.pending$.next(true);
		this.signIn(credential)
			.pipe(finalize(() => this.pending$.next(false)))
			.subscribe({
				next: (response: R) => {
					this.in$.next(response);
				},
				error: (error: HttpErrorResponse) => this.error$.next(error),
			});
	}

	override signOut(): Observable<never> {
		this.pending$.next(true);
		google.accounts.id.disableAutoSelect();
		return super.signOut().pipe(
			tap(() => this.out$.next()),
			finalize(() => this.pending$.next(false)),
		);
	}
}
