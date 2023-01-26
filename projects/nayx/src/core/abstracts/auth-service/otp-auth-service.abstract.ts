import { Observable } from 'rxjs';
import {
	OTPAuthResponse,
	BasicAuthResponse,
	OTPSigninCredentials,
} from '@nayx/core/models';
import { AuthService } from '@nayx/core/abstracts/auth-service';

export abstract class OTPAuthService<
	T,
	R extends OTPAuthResponse,
	V extends BasicAuthResponse,
> extends AuthService<T> {
	abstract signIn(credentials: OTPSigninCredentials): Observable<R>;
	abstract verifyOTP(token: string): Observable<V>;
}
