import { iif, map, Observable, of, switchMap } from 'rxjs';
import {
	Permission,
	PermissionsService,
	StringIfNever,
	GrantValidatorFuncReturnType,
} from '@nayx/core/abstracts';
import { inject } from '@angular/core';
import { runValidators } from '@nayx/permissions/utils';

export function permissionOnlyGuard<T extends string = never>(
	...args: GrantValidatorFuncReturnType<T>[] | StringIfNever<T>[]
): Observable<boolean> {
	const permissionService = inject<PermissionsService<T>>(PermissionsService);

	return iif(
		() => !args.length,
		of(false),
		permissionService.permissions$.pipe(
			switchMap((permissions: Permission<T>[]) =>
				runValidators(permissions, args),
			),
			map((arr: boolean[]) => arr.every(Boolean)),
		),
	);
}
