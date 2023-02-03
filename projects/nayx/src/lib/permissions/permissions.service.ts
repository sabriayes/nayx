import { AccountPermissionService, Permission } from '@nayx/core/abstracts';
import {
	BehaviorSubject,
	catchError,
	Observable,
	retry,
	tap,
	throwError,
} from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
	ACCOUNT_PERMISSIONS_SERVICE_OPTIONS,
	AccountPermissionServiceOptions,
} from '@nayx/permissions/options';

export class AccountPermissionsService<T> extends AccountPermissionService<T> {
	public http = inject(HttpClient);
	public permissions$ = new BehaviorSubject<Permission<T>[]>([]);
	public options = inject<AccountPermissionServiceOptions>(
		ACCOUNT_PERMISSIONS_SERVICE_OPTIONS,
	);

	import(permissions: Permission<T>[]): void {
		this.permissions$.next(permissions);
	}

	importLazy(): Observable<Permission<T>[]> {
		const { retryLimit } = this.options;

		return this.http.get<Permission<T>[]>(this.options.apiURL).pipe(
			retry(retryLimit),
			tap((permissions: Permission<T>[]) =>
				this.permissions$.next(permissions),
			),
			catchError((err) => {
				this.permissions$.next([]);
				return throwError(() => err);
			}),
		);
	}

	remove(scopes: T[]): void {
		const permissions = this.permissions$.value;
		this.permissions$.next(
			permissions.filter((item) => !scopes.includes(item.scope)),
		);
	}

	add(newPermission: Permission<T>): void {
		const permissions = this.permissions$.value;
		const foundSameItem: Permission<T> | undefined = permissions.find(
			(item) => item.scope === newPermission.scope,
		);
		if (!foundSameItem) {
			this.permissions$.next([...permissions, newPermission]);
			return;
		}
		foundSameItem.grants = newPermission.grants;
		this.permissions$.next([...permissions]);
	}

	check(scope: T): Permission<T>['grants'] {
		const permissions = this.permissions$.value;
		const foundPermission: Permission<T> | undefined = permissions.find(
			(item) => item.scope === scope,
		);
		if (foundPermission) {
			return foundPermission.grants;
		}
		return {
			hasAccess: false,
			hasCreate: false,
			hasRead: false,
			hasUpdate: false,
			hasDelete: false,
		} as Permission<T>['grants'];
	}

	clear() {
		this.permissions$.next([]);
	}
}

/**
 *  [
 *      path: 'dashboard',
 *      component: DashboardPageComponent,
 *      canActivate: [
 *          permissionOnly(hasAny('dashboard')),
 *          permissionExpect(hasAny('dashboard')),
 *          permissionAny(
 *              permissionValidators('dashboard),
 *              hasRead('dashboard'),
 *          )
 *          permissionEvery(
 *              permissionValidators('dashboard'),
 *              hasRead(['user', 'books')
 *          ),
 *      ]
 *  ]
 */
