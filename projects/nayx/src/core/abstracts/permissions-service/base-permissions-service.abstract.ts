import { BehaviorSubject, Observable } from 'rxjs';
import { PermissionsServiceOptions } from '@nayx/core/models';

export type GrantType =
	| 'hasAccess'
	| 'hasCreate'
	| 'hasRead'
	| 'hasUpdate'
	| 'hasDelete';

export type Permission<T extends keyof never = GrantType> = {
	scope: string;
	grants: Record<T, boolean>;
};

export abstract class PermissionsService<K, P extends keyof never> {
	abstract options: PermissionsServiceOptions;
	abstract permissions$: BehaviorSubject<Permission<P>[]>;
	abstract import(permissions: Permission<P>[]): void;
	abstract importLazy(): Observable<Permission<P>[]>;
	abstract add(permission: Permission<P>): void;
	abstract remove(scopes: K[]): void;
	abstract clear(): void;
	abstract check(scope: K): Permission<P>['grants'];
}
