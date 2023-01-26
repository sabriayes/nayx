import { Observable } from 'rxjs';
import { SigninCredentials, OTPAuthResponse } from '@nayx/core/models';
import { AuthService } from '@nayx/core/abstracts';

export abstract class OTPAuthService<
	T,
	R extends OTPAuthResponse,
> extends AuthService<R> {
	abstract signIn(credentials: SigninCredentials): Observable<R>;
	abstract verifyOTP(code: string): Observable<T>;
}
