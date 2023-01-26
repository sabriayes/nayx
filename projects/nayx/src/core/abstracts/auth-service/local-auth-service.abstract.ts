import { Observable } from 'rxjs';
import { SigninCredentials, BasicAuthResponse } from '@nayx/core/models';
import { AuthService } from '@nayx/core/abstracts';

export abstract class LocalAuthService<
	T,
	R extends BasicAuthResponse,
> extends AuthService<T> {
	abstract signIn(credentials: SigninCredentials): Observable<R>;
}
