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
	K,
	P extends keyof never = never,
> extends AccountPermissionService<K, P> {
	public http = inject(HttpClient);
	public permissions$ = new BehaviorSubject<Permission<P>[]>([]);
	public options = inject<AccountPermissionServiceOptions>(
		ACCOUNT_PERMISSIONS_SERVICE_OPTIONS,
	);

	import(permissions: Permission<P>[]): void {
		this.permissions$.next(permissions);
	}

	importLazy(): Observable<Permission<P>[]> {
		const { retryLimit } = this.options;

		return this.http.get<Permission<P>[]>(this.options.apiURL).pipe(
			retry(retryLimit),
			tap((permissions: Permission<P>[]) =>
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

	add(newPermission: Permission<P>): void {
		const permissions = this.permissions$.value;
		const foundSameItem: Permission<P> | undefined = permissions.find(
			(item) => item.scope === newPermission.scope,
		);
		if (!foundSameItem) {
			this.permissions$.next([...permissions, newPermission]);
			return;
		}
		foundSameItem.grants = newPermission.grants;
		this.permissions$.next([...permissions]);
	}

	check(scope: K): Permission<P>['grants'] {
		const permissions = this.permissions$.value;
		const foundPermission: Permission<P> | undefined = permissions.find(
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
		} as Permission<P>['grants'];
	}

	clear() {
		this.permissions$.next([]);
	}
}

/**
 *
 *  [
 *      path: 'dashboard',
 *      component: DashboardPageComponent,
 *      canActivate: [
 *          permissionOnly(hasAny('dashboard')),
 *          permissionExpect(hasAny('dashboard')),
 *          permissionAny(
 *              hasAccess('dashboard),
 *              hasRead('dashboard'),
 *          )
 *          permissionEvery(
 *              hasAccess('dashboard'),
 *              hasRead(['user', 'books')
 *          ),
 *      ]
 *  ]
 */
