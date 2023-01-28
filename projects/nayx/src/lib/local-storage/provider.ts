import { makeEnvironmentProviders } from '@angular/core';
import { StorageService } from '@nayx/core/abstracts';
import { LocalStorageService } from '@nayx/local-storage/local-storage.service';

export const providerNayxLocalStorage = () =>
	makeEnvironmentProviders([
		{
			provide: StorageService,
			useClass: LocalStorageService,
		},
	]);
