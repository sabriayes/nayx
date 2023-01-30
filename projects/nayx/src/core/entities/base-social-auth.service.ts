import { inject, Injectable } from '@angular/core';
import { NullInjectionError, SocialAuthServiceOptions } from '@nayx/core/index';
import { BaseAuthenticationService } from './base-auth.service';
import { ProvidableAuthService } from '@nayx/core/abstracts/auth-service';
import { from, iif, Observable, of, switchMap, throwError } from 'rxjs';
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
		Options extends SocialAuthServiceOptions,
	>
	extends BaseAuthenticationService<A, Options>
	implements ProvidableAuthService
{
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
}
