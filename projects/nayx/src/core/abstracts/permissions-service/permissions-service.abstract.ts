import { BehaviorSubject, Observable } from 'rxjs';
import { PermissionsServiceOptions } from '@nayx/core/models';

export type GrantType =
	| 'hasAccess'
	| 'hasCreate'
	| 'hasRead'
	| 'hasUpdate'
	| 'hasDelete';

export type Permission = {
	scope: string;
	grants: Record<GrantType, boolean>;
};

export abstract class PermissionsService<T = string> {
	abstract options: PermissionsServiceOptions;
	abstract permissions$: BehaviorSubject<Permission[]>;
	abstract import(permissions: Permission[]): void;
	abstract importLazy(): Observable<Permission[]>;
	abstract add(permission: Permission): void;
	abstract remove(scopes: T[]): void;
	abstract clear(): void;
	abstract check(scope: T): Record<GrantType, boolean>;
}
