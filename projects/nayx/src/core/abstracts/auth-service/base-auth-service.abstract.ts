import { BehaviorSubject, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export abstract class AuthService<T> {
	abstract account$: BehaviorSubject<T | undefined>;
	abstract isAuth(): Observable<boolean>;
	abstract verifyAccount(): Observable<T | HttpErrorResponse>;
	abstract signOut(): Observable<never>;
}
