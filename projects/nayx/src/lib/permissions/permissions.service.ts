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

export class AccountPermissionsService<
	K extends string = never,
> extends AccountPermissionService<K> {
	public http = inject(HttpClient);
	public permissions$ = new BehaviorSubject<Permission<K>[]>([]);
	public options = inject<AccountPermissionServiceOptions>(
		ACCOUNT_PERMISSIONS_SERVICE_OPTIONS,
	);

	import(permissions: Permission<K>[]): void {
		this.permissions$.next(permissions);
	}

	importLazy(): Observable<Permission<K>[]> {
		const { retryLimit } = this.options;

		return this.http.get<Permission<K>[]>(this.options.apiURL).pipe(
			retry(retryLimit),
			tap((permissions: Permission<K>[]) =>
				this.permissions$.next(permissions),
			),
			catchError((err) => {
				this.permissions$.next([]);
				return throwError(() => err);
			}),
		);
	}

	remove(scopes: K[]): void {
		const permissions = this.permissions$.value;
		this.permissions$.next(
			permissions.filter((item) => !scopes.includes(item.scope as K)),
		);
	}

	add(newPermission: Permission<K>): void {
		const permissions = this.permissions$.value;
		const foundSameItem: Permission<K> | undefined = permissions.find(
			(item) => item.scope === newPermission.scope,
		);
		if (!foundSameItem) {
			this.permissions$.next([...permissions, newPermission]);
			return;
		}
		foundSameItem.grants = newPermission.grants;
		this.permissions$.next([...permissions]);
	}

	check(scope: K): Permission<K>['grants'] {
		const permissions = this.permissions$.value;
		const foundPermission: Permission<K> | undefined = permissions.find(
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
		} as Permission<K>['grants'];
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
