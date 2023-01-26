import { Observable } from 'rxjs';
import { SigninCredentials, BasicAuthResponse } from '@naylalabs/core/models';
import { AuthService } from './auth-service.abstract';

export abstract class LocalAuthService<
	T,
	R extends BasicAuthResponse,
> extends AuthService<T> {
	abstract signIn(credentials: SigninCredentials): Observable<R>;
}
