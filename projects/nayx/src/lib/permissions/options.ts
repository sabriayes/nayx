import { InjectionToken } from '@angular/core';
import { PermissionsServiceOptions } from '@nayx/core/models';

export type AccountPermissionServiceOptions = PermissionsServiceOptions;

export const ACCOUNT_PERMISSIONS_SERVICE_DEFAULT_OPTIONS: AccountPermissionServiceOptions =
	{
		retryLimit: 1,
		apiURL: 'http://localhost',
	};

export const ACCOUNT_PERMISSIONS_SERVICE_OPTIONS: InjectionToken<AccountPermissionServiceOptions> =
	new InjectionToken('ACCOUNT_PERMISSIONS_SERVICE_OPTIONS', {
		providedIn: 'root',
		factory: () => ACCOUNT_PERMISSIONS_SERVICE_DEFAULT_OPTIONS,
	});
