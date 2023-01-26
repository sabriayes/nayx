import { Observable } from 'rxjs';
import { SigninCredentials, OTPAuthResponse } from '@naylalabs/core/models';
import { AuthService } from './auth-service.abstract';

export abstract class OTPAuthService<
	T,
	R extends OTPAuthResponse,
> extends AuthService<R> {
	abstract signIn(credentials: SigninCredentials): Observable<R>;
	abstract verifyOTP(code: string): Observable<T>;
}
