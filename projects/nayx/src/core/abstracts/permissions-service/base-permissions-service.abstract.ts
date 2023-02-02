import { BehaviorSubject, Observable } from 'rxjs';
import { PermissionsServiceOptions } from '@nayx/core/models';

export type GrantValidatorFuncReturnType<T extends string = never> = (
	perm: Permission<T>,
) => boolean;

export type StringIfNever<T> = T extends never ? string : T;

export type GrantType =
	| 'hasAccess'
	| 'hasCreate'
	| 'hasRead'
	| 'hasUpdate'
	| 'hasDelete';

export type PermissionGrants = Partial<Record<GrantType, boolean>>;
export type Permission<T extends string = never> = {
	scope: StringIfNever<T>;
	grants: PermissionGrants;
};

export abstract class PermissionsService<K extends string = never> {
	abstract options: PermissionsServiceOptions;
	abstract permissions$: BehaviorSubject<Permission<K>[]>;
	abstract import(permissions: Permission<K>[]): void;
	abstract importLazy(): Observable<Permission<K>[]>;
	abstract add(permission: Permission<K>): void;
	abstract remove(scopes: K[]): void;
	abstract clear(): void;
	abstract check(scope: K): Permission<K>['grants'];
}
