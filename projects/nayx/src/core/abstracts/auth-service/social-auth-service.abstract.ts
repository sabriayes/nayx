import { Observable, Subject } from 'rxjs';
import { AuthService } from '@nayx/core/abstracts/auth-service/base-auth-service.abstract';
import { BasicAuthResponse } from '@nayx/core/models';

export abstract class SocialAuthService<
	T,
	R extends BasicAuthResponse,
> extends AuthService<T> {
	abstract init$: Subject<void>;
	abstract in$: Subject<R>;
	abstract out$: Subject<void>;
	abstract error$: Subject<Error>;
	abstract signIn(idToken: string): Observable<R>;
}
