import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { BasicAuthResponse } from '@nayx/core/models';
import { AuthService } from '@nayx/core/abstracts/auth-service';

export abstract class SocialAuthService<
	T,
	R extends BasicAuthResponse,
> extends AuthService<T> {
	abstract init$: Subject<null>;
	abstract in$: BehaviorSubject<R | null>;
	abstract out$: BehaviorSubject<null>;
	abstract error$: BehaviorSubject<Error | null>;
	abstract signIn(idToken: string): Observable<R>;
}
