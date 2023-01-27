import { Router, UrlTree } from '@angular/router';
import { inject } from '@angular/core';
import { LocalAuthService, TokensService, AuthToken } from '@nayx/core/index';
import { catchError, iif, Observable, of, switchMap } from 'rxjs';

type AuthGuardReturnType = () => Observable<boolean | UrlTree>;
type PropertiesType<T> = (keyof T)[];

/**
 * Oturum durumunu kontrol eder, başarılı ise rotaya erişim için izin verir.
 * Olumsuz durumda ise **{to}** rotasına yönlendirme yapar. **accessToken**
 * bilgisi varsa **LocalAuthService.verifyAccount()** çağrısı ile oturum
 * doğrulanır.
 *
 * @param to - Yönlendirme yapılacak olan yol
 * @param props - Kullanıcın hesap bilgisinde `true` olması gereken anahtarlar
 * @return Observable<boolean|UrlTree>
 *
 * @example
 * ```ts
 * {
 *      path: 'dashboard',
 *      component: DashboardComponent,
 *      canActivate: [
 *          authGuard<Account>(['/auth], ['isProfileCompelete'])
 *      ]
 * }
 * ```
 */
export function authGuard<T>(
	to: unknown[],
	props: PropertiesType<T> = [],
): AuthGuardReturnType {
	return function () {
		const router = inject(Router);
		const accessToken = inject(TokensService).get(AuthToken.ACCESS_TOKEN);

		const generateUrlTree = () => of(router.createUrlTree(to));
		const validateProps = (res: T) =>
			props.every((prop) => res[prop]) ? of(true) : generateUrlTree();

		return of(accessToken).pipe(
			switchMap((accessToken: string | undefined) =>
				iif(
					() => !accessToken,
					generateUrlTree(),
					inject(LocalAuthService)
						.verifyAccount()
						.pipe(switchMap(validateProps)),
				),
			),
			catchError(generateUrlTree),
		);
	};
}
