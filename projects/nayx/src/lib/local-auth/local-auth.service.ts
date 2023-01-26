import { inject, Injectable } from '@angular/core';
import {
	AuthEndpoint,
	AuthToken,
	BaseAuthenticationService,
	ConfigurableAuthService,
	LocalAuthService,
	SigninCredentials,
	BasicAuthResponse,
} from '@nayx/core/index';
import {
	LocalAuthServiceOptions,
	LOCAL_AUTH_SERVICE_OPTIONS,
} from './options.const';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';

@Injectable()
export class LocalAuthenticationService<A, R extends BasicAuthResponse>
	extends BaseAuthenticationService<A, LocalAuthServiceOptions>
	implements
		LocalAuthService<A, R>,
		ConfigurableAuthService<LocalAuthServiceOptions>
{
	public override readonly options = inject<LocalAuthServiceOptions>(
		LOCAL_AUTH_SERVICE_OPTIONS,
	);

	signIn(credentials: Partial<SigninCredentials>): Observable<R> {
		const { retryLimit } = this.options;
		delete credentials.type;

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
}
