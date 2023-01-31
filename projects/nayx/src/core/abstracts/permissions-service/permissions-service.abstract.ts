import { BehaviorSubject } from 'rxjs';

type GrantType =
	| 'hasAccess'
	| 'hasCreate'
	| 'hasRead'
	| 'hasUpdate'
	| 'hasDelete';
type Permission = {
	scope: string;
	grants: Record<GrantType, boolean>;
};

export abstract class PermissionsService<T = string> {
	abstract permissions$: BehaviorSubject<Permission[]>;
	abstract import(permissions: Permission[]): void;
	abstract importLazy(): void;
	abstract add(permission: Permission): void;
	abstract remove(scopes: T[]): void;
	abstract clear(): void;
	abstract check(scope: T): Record<GrantType, boolean>;
}
