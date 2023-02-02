import {
	GrantValidatorFuncReturnType,
	Permission,
	StringIfNever,
} from '@nayx/core/abstracts';
import { iif, Observable, of } from 'rxjs';

export const isArgumentString = (argument: unknown): boolean =>
	typeof argument === 'string';

export const validateWithFunc = <T extends string = never>(
	permissions: Permission<T>[],
	args: GrantValidatorFuncReturnType<T>[],
): Observable<boolean[]> =>
	of(args.map((fn) => permissions.some((perm) => fn(perm))));

export const validateWithScopeName = <T extends string = never>(
	permissions: Permission<T>[],
	args: StringIfNever<T>[],
): Observable<boolean[]> =>
	of(
		args.map((argument) =>
			permissions.some(
				(perm) => perm.scope === argument && !!perm.grants.hasAccess,
			),
		),
	);

export const runValidators = <T extends string = never>(
	permissions: Permission<T>[],
	args: unknown[],
): Observable<boolean[]> =>
	iif(
		() => !isArgumentString(args[0]),
		validateWithFunc(
			permissions,
			args as GrantValidatorFuncReturnType<T>[],
		),
		validateWithScopeName(permissions, args as StringIfNever<T>[]),
	);
