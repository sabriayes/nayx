import { makeEnvironmentProviders } from '@angular/core';
import {
	PermissionsService,
	PermissionsServiceOptions,
} from '@nayx/core/index';
import {
	ACCOUNT_PERMISSIONS_SERVICE_DEFAULT_OPTIONS,
	ACCOUNT_PERMISSIONS_SERVICE_OPTIONS,
} from '@nayx/permissions/options';
import { AccountPermissionsService } from '@nayx/permissions/permissions.service';

export const provideNayxPermissions = (
	options?: Partial<PermissionsServiceOptions>,
) =>
	makeEnvironmentProviders([
		{
			provide: ACCOUNT_PERMISSIONS_SERVICE_OPTIONS,
			useValue: Object.assign(
				ACCOUNT_PERMISSIONS_SERVICE_DEFAULT_OPTIONS,
				options,
			),
		},
		{
			provide: PermissionsService,
			useClass: AccountPermissionsService,
		},
	]);
