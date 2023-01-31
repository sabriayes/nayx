import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '@nayx/core/abstracts/auth-service/base-auth-service.abstract';
import { BasicAuthResponse } from '@nayx/core/models';

export abstract class SocialAuthService<
	T,
	R extends BasicAuthResponse,
> extends AuthService<T> {
	abstract init$: BehaviorSubject<boolean>;
	abstract in$: BehaviorSubject<R | void>;
	abstract out$: BehaviorSubject<void>;
	abstract error$: BehaviorSubject<Error | void>;
	abstract pending$: BehaviorSubject<boolean>;
	abstract signIn(authToken: string): Observable<R>;
}
