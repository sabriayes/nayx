import { Observable } from 'rxjs';

export abstract class ProvideAuthService {
	abstract appendScript(
		id: string,
		scriptURL: string,
	): Observable<void | Error>;
}
