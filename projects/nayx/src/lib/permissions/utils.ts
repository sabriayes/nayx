import { GrantValidatorFuncReturnType, Permission } from '@nayx/core/abstracts';
import { defer, iif, Observable, of } from 'rxjs';

export const isArgumentString = (argument: unknown): boolean => {
	return typeof argument === 'string';
};

export const validateWithFunc = (
	permissions: Permission[],
	args: GrantValidatorFuncReturnType[],
): Observable<boolean[]> =>
	of(args.map((fn) => permissions.some((perm) => fn(perm))));

export const validateWithScopeName = (
	permissions: Permission[],
	args: string[],
): Observable<boolean[]> =>
	of(
		args.map((argument) =>
			permissions.some(
				(perm) => perm.scope === argument && !!perm.grants.hasAccess,
			),
		),
	);

export const runValidators = (
	permissions: Permission[],
	args: unknown[],
): Observable<boolean[]> =>
	iif(
		() => !isArgumentString(args[0]),
		defer(() =>
			validateWithFunc(
				permissions,
				args as GrantValidatorFuncReturnType[],
			),
		),
		defer(() => validateWithScopeName(permissions, args as string[])),
	);
