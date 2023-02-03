import { iif, map, of, switchMap } from 'rxjs';
import {
	Permission,
	PermissionsService,
	GrantValidatorFuncReturnType,
} from '@nayx/core/abstracts';
import { inject } from '@angular/core';
import { runValidators } from '@nayx/permissions/utils';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';

export function permissionEveryGuard(
	...args: GrantValidatorFuncReturnType[] | string[]
): CanActivateFn | CanActivateChildFn {
	return function () {
		const router = inject(Router);
		const permissionService =
			inject<PermissionsService>(PermissionsService);

		const redirectTo = router.createUrlTree(
			permissionService.options.redirectTo,
		);

		return iif(
			() => !args.length,
			of(redirectTo),
			permissionService.permissions$.pipe(
				switchMap((permissions: Permission[]) =>
					runValidators(permissions, args),
				),
				map((arr: boolean[]) => arr.every(Boolean) || redirectTo),
			),
		);
	};
}
