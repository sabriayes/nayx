import {
	GrantType,
	GrantValidatorFuncReturnType,
	Permission,
} from '@nayx/core/abstracts';

const grantProps: GrantType[] = [
	'hasAccess',
	'hasCreate',
	'hasRead',
	'hasUpdate',
	'hasDelete',
];

export function hasAll<T = string>(scope: T): GrantValidatorFuncReturnType {
	return (perms: Permission<T>) =>
		perms.scope === scope &&
		grantProps.map((prop) => perms.grants[prop]).every(Boolean);
}

export function hasAccess<T = string>(scope: T): GrantValidatorFuncReturnType {
	return (perms: Permission<T>) =>
		perms.scope === scope && !!perms.grants.hasAccess;
}

export function hasCreate<T = string>(scope: T): GrantValidatorFuncReturnType {
	return (perms: Permission<T>) =>
		perms.scope === scope && !!perms.grants.hasCreate;
}

export function hasRead<T = string>(scope: T): GrantValidatorFuncReturnType {
	return (perms: Permission<T>) =>
		perms.scope === scope && !!perms.grants.hasRead;
}

export function hasUpdate<T = string>(scope: T): GrantValidatorFuncReturnType {
	return (perms: Permission<T>) =>
		perms.scope === scope && !!perms.grants.hasUpdate;
}

export function hasDelete<T = string>(scope: T): GrantValidatorFuncReturnType {
	return (perms: Permission<T>) =>
		perms.scope === scope && !!perms.grants.hasDelete;
}
