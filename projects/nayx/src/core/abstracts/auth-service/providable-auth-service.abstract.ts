import { Observable } from 'rxjs';

export abstract class ProvidableAuthService {
	abstract appendScript(
		id: string,
		scriptURL: string,
	): Observable<void | Error>;
}
