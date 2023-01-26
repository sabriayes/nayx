import { inject, Injectable } from '@angular/core';
import {
	ConfigurableAuthService,
	OTPAuthService,
	AuthEndpoint,
	AuthToken,
	BaseAuthenticationService,
	BasicAuthResponse,
	OTPAuthResponse,
	OTPSigninCredentials,
} from '@nayx/core/index';
import {
	OTPAuthServiceOptions,
	OTP_AUTH_SERVICE_OPTIONS,
} from './options.const';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';

@Injectable()
export class OTPAuthenticationService<
		A,
		R extends OTPAuthResponse,
		V extends BasicAuthResponse,
	>
	extends BaseAuthenticationService<A, OTPAuthServiceOptions>
	implements
		OTPAuthService<A, R, V>,
		ConfigurableAuthService<OTPAuthServiceOptions>
{
	public override readonly options = inject<OTPAuthServiceOptions>(
		OTP_AUTH_SERVICE_OPTIONS,
	);

	signIn(credentials: Partial<OTPSigninCredentials>): Observable<R> {
		const { retryLimit } = this.options;
		delete credentials.type;

		return this.http
			.post<R>(this.getEndpoint(AuthEndpoint.SIGN_IN), credentials, {
				context: this.context,
			})
			.pipe(
				retry(retryLimit),
				catchError((err) => {
					return throwError(() => err);
				}),
			);
	}

	verifyOTP(token: string): Observable<V> {
		const { retryLimit } = this.options;
		return this.http
			.post<V>(
				this.getEndpoint(AuthEndpoint.VERIFY_OTP),
				{ token },
				{
					context: this.context,
				},
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
