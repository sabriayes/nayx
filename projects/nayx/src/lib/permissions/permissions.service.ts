import {
	GrantType,
	Permission,
	PermissionsService,
} from '@nayx/core/abstracts';
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

export class AccountPermissionsService extends PermissionsService {
	public http = inject(HttpClient);
	public permissions$ = new BehaviorSubject<Permission[]>([]);
	public options = inject<AccountPermissionServiceOptions>(
		ACCOUNT_PERMISSIONS_SERVICE_OPTIONS,
	);

	import(permissions: Permission[]): void {
		this.permissions$.next(permissions);
	}

	importLazy(): Observable<Permission[]> {
		const { retryLimit } = this.options;

		return this.http.get<Permission[]>(this.options.apiURL).pipe(
			retry(retryLimit),
			tap((permissions: Permission[]) =>
				this.permissions$.next(permissions),
			),
			catchError((err) => {
				this.permissions$.next([]);
				return throwError(() => err);
			}),
		);
	}

	remove(scopes: string[]): void {
		const permissions = this.permissions$.value;
		this.permissions$.next(
			permissions.filter((item) => !scopes.includes(item.scope)),
		);
	}

	add(newPermission: Permission): void {
		const permissions = this.permissions$.value;
		const foundSameItem: Permission | undefined = permissions.find(
			(item) => item.scope === newPermission.scope,
		);
		if (!foundSameItem) {
			this.permissions$.next([...permissions, newPermission]);
			return;
		}
		foundSameItem.grants = newPermission.grants;
		this.permissions$.next([...permissions]);
	}

	check(scope: string): Record<GrantType, boolean> {
		const permissions = this.permissions$.value;
		const foundPermission: Permission | undefined = permissions.find(
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
		};
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
 *           permissionSome(['dashboard', 'users']),
 *           permissionSome(['dashboard', 'users'], 'hasAccess'),
 *          permissionSome({
 *              dashboard: ['hasAccess', 'hasRead'],
 *              users: ['hasAccess'],
 *          }),
 *          permissionOnly(hasAny('dashboard')),
 *          permissionAny(
 *              hasAccess('dashboard),
 *              hasRead
 *          )
 *          permissionSome(
 *              hasAccess('dashboard'),
 *              hasRead(['user', 'books')
 *          ),
 *
 *
 *      ]
 *  ]
 */
