import { PermissionsService } from '@nayx/core/abstracts';

export abstract class AccountPermissionService<
	K,
	P extends keyof never,
> extends PermissionsService<K, P> {}
