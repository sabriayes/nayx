import { inject, Injectable } from '@angular/core';
import {
	AuthEndpoint,
	AuthToken,
	BasicAuthResponse,
	NullInjectionError,
	SocialAuthServiceOptions,
} from '@nayx/core/index';
import { BaseAuthenticationService } from './base-auth.service';
import { ProvidableAuthService } from '@nayx/core/abstracts/auth-service';
import {
	BehaviorSubject,
	catchError,
	from,
	iif,
	Observable,
	of,
	retry,
	switchMap,
	tap,
	throwError,
} from 'rxjs';
import { DOCUMENT } from '@angular/common';

type AddScriptsArg = {
	id: string;
	scriptURL: string;
	document: Document;
};

const addScriptTag = ({
	id,
	scriptURL,
	document,
}: AddScriptsArg): Promise<void> =>
	new Promise((res) => {
		const script = document.createElement('script');
		script.async = true;
		script.id = id;
		script.onload = () => res();
		script.src = scriptURL;
		document.head.appendChild(script);
	});

@Injectable()
export class BaseSocialAuthenticationService<
		A,
		R extends BasicAuthResponse,
		Options extends SocialAuthServiceOptions,
	>
	extends BaseAuthenticationService<A, Options>
	implements ProvidableAuthService
{
	public init$ = new BehaviorSubject<boolean>(false);
	public in$ = new BehaviorSubject<R | void>(undefined);
	public out$ = new BehaviorSubject<void>(undefined);
	public error$ = new BehaviorSubject<Error | void>(undefined);
	public pending$ = new BehaviorSubject<boolean>(false);

	appendScript(id: string, scriptURL: string): Observable<void | Error> {
		return of(inject(DOCUMENT)).pipe(
			switchMap((document) =>
				iif(
					() => !document,
					throwError(() => new NullInjectionError('Document')),
					iif(
						() => !scriptURL || !id,
						throwError(() => new Error('Missing script options!')),
						of(document),
					),
				),
			),
			switchMap((document) =>
				from(addScriptTag({ document, id, scriptURL })),
			),
		);
	}

	completeSubjects() {
		this.init$?.complete();
		this.out$?.complete();
		this.error$?.complete();
		this.account$?.complete();
	}

	signIn(authToken: string): Observable<R> {
		const { retryLimit } = this.options;

		return this.http
			.post<R>(
				this.getEndpoint(AuthEndpoint.SIGN_IN),
				{ [this.options.requestKey]: authToken },
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
