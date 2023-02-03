import {
	CanActivateChildFn,
	CanActivateFn,
	Router,
	UrlTree,
} from '@angular/router';
import { inject } from '@angular/core';
import { LocalAuthService, TokensService, AuthToken } from '@nayx/core/index';
import { catchError, iif, map, of, switchMap } from 'rxjs';

type AccountValidatorFunc = <T>(account?: T) => boolean;

/**
 * TODO: @sabriayes - Hesap doğrulama işlemi için ClassValidator kullanılmalı.
 * https://github.com/typestack/class-validator
 *
 * Oturum durumunu kontrol eder, başarılı ise rotaya erişim için izin verir.
 * Olumsuz durumda ise **{to}** rotasına yönlendirme yapar. **accessToken**
 * bilgisi varsa **LocalAuthService.verifyAccount()** çağrısı ile oturum
 * doğrulanır.
 *
 * @param to - Yönlendirme yapılacak olan yol
 * @param validatorFunc? - Hesap içeriğini doğrulayan fonksiyonu
 * @return Observable<boolean|UrlTree>
 *
 * @example
 * ```ts
 * {
 *      path: 'dashboard',
 *      component: DashboardComponent,
 *      canActivate: [
 *          authGuard<Account>(
 *              ['/auth'],
 *              (user: User) => user.isProfileComplete
 *          )
 *      ]
 * }
 * ```
 */
export function authGuard<T>(
	to: unknown[],
	validatorFunc: AccountValidatorFunc = () => true,
): CanActivateFn | CanActivateChildFn {
	return function () {
		const router = inject(Router);
		const accessToken = inject(TokensService).get(AuthToken.ACCESS_TOKEN);

		const generateUrlTree = () => of(router.createUrlTree(to));

		return of(accessToken).pipe(
			switchMap((accessToken: string | undefined) =>
				iif(
					() => !accessToken,
					generateUrlTree(),
					inject(LocalAuthService)
						.verifyAccount()
						.pipe(map(validatorFunc<T>)),
				),
			),
			catchError(generateUrlTree),
		);
	};
}
