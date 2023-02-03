import { PermissionsService } from '@nayx/core/abstracts/permissions-service/base-permissions-service.abstract';

export abstract class AccountPermissionService<
	T,
> extends PermissionsService<T> {}
