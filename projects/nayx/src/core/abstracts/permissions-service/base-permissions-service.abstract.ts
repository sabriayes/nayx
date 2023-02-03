import { BehaviorSubject, Observable } from 'rxjs';
import { PermissionsServiceOptions } from '@nayx/core/models';

export type GrantValidatorFuncReturnType = (perm: Permission<any>) => boolean;

export type GrantType =
	| 'hasAccess'
	| 'hasCreate'
	| 'hasRead'
	| 'hasUpdate'
	| 'hasDelete';

export type PermissionGrants = Partial<Record<GrantType, boolean>>;
export type Permission<T = string> = {
	scope: T;
	grants: PermissionGrants;
};

export abstract class PermissionsService<T = string> {
	abstract options: PermissionsServiceOptions;
	abstract permissions$: BehaviorSubject<Permission<T>[]>;
	abstract import(permissions: Permission<T>[]): void;
	abstract importLazy(): Observable<Permission<T>[]>;
	abstract add(permission: Permission<T>): void;
	abstract remove(scopes: T[]): void;
	abstract clear(): void;
	abstract check(scope: T): Permission<T>['grants'];
}
