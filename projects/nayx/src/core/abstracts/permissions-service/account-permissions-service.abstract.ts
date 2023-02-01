import { PermissionsService } from '@nayx/core/abstracts/permissions-service/base-permissions-service.abstract';

export abstract class AccountPermissionService<
	K,
	P extends keyof never,
> extends PermissionsService<K, P> {}
