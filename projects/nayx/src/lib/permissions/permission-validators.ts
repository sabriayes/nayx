import { GrantType, Permission, StringIfNever } from '@nayx/core/abstracts';

const validate = <T extends string = never>(
	perms: Permission<T>,
	scope: StringIfNever<T>,
	grantType: GrantType,
) => perms.scope === scope && !!perms.grants[grantType];

export function hasAccess<T extends string = never>(scope: StringIfNever<T>) {
	return (perms: Permission<T>) => validate<T>(perms, scope, 'hasAccess');
}

export function hasCreate<T extends string = never>(scope: StringIfNever<T>) {
	return (perms: Permission<T>) => validate<T>(perms, scope, 'hasCreate');
}

export function hasRead<T extends string = never>(scope: StringIfNever<T>) {
	return (perms: Permission<T>) => validate<T>(perms, scope, 'hasRead');
}

export function hasUpdate<T extends string = never>(scope: StringIfNever<T>) {
	return (perms: Permission<T>) => validate<T>(perms, scope, 'hasUpdate');
}

export function hasDelete<T extends string = never>(scope: StringIfNever<T>) {
	return (perms: Permission<T>) => validate<T>(perms, scope, 'hasDelete');
}
