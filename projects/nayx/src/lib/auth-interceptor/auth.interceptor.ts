import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokensService } from '@nayx/core/abstracts';
import { AuthToken } from '@nayx/core/enums';
import { iif, of, switchMap } from 'rxjs';
import { IS_INTERCEPTORS_ENABLED } from '@nayx/contexts';

function cloneRequest(
	req: HttpRequest<unknown>,
	accessToken: string | undefined,
): HttpRequest<unknown> {
	return req.clone({
		setHeaders: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
}

/**
 * Mecvut HTTP çağrısını modifiye eder. Çağrı başlığına **Authorization**
 * anahtarını **Bearer** yöntemi ile ekler. **IS_INTERCEPTORS_ENABLED** bilgisi
 * çağrı context'inde yoksa herhangi bir değişkilik yapmaz.
 * @param req - Mevcut HTTP çağrısı
 * @param next
 */
export function authInterceptor(
	req: HttpRequest<unknown>,
	next: HttpHandlerFn,
) {
	const accessToken = inject(TokensService).get(AuthToken.ACCESS_TOKEN);
	return of(accessToken).pipe(
		switchMap((accessToken: string | undefined) =>
			iif(
				() => !accessToken || !req.context.get(IS_INTERCEPTORS_ENABLED),
				next(req),
				of(cloneRequest(req, accessToken)).pipe(
					switchMap((request: HttpRequest<unknown>) => next(request)),
				),
			),
		),
	);
}
