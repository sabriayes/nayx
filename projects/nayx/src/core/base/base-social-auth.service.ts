import { Injectable } from '@angular/core';
import { NullInjectionError, SocialAuthServiceOptions } from '@nayx/core/index';
import { BaseAuthenticationService } from '@nayx/core/base/base-auth.service';
import { ProvideAuthService } from '@nayx/core/abstracts/auth-service/provide-auth-service.abstract';

@Injectable()
export class BaseSocialAuthenticationService<
		A,
		Options extends SocialAuthServiceOptions,
	>
	extends BaseAuthenticationService<A, Options>
	implements ProvideAuthService
{
	appendScript(
		document: Document,
		providerId: string,
		apiURL: string,
	): Promise<null> {
		if (!apiURL || !providerId) {
			return Promise.reject(new Error('Missing script options!'));
		}

		if (!document) {
			return Promise.reject(new NullInjectionError('Document'));
		}

		if (document.getElementById(providerId)) {
			return Promise.reject();
		}

		return new Promise((res) => {
			const script = document.createElement('script');

			script.async = true;
			script.id = providerId;
			script.onload = () => res(null);
			script.src = apiURL;
			document.head.appendChild(script);
		});
	}
}
