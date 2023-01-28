import { makeEnvironmentProviders } from '@angular/core';
import { StorageService } from '@nayx/core/abstracts';
import { MemoryStorageService } from '@nayx/memory-storage/memory-storage.service';

export const providerNayxMemoryStorage = () =>
	makeEnvironmentProviders([
		{
			provide: StorageService,
			useClass: MemoryStorageService,
		},
	]);
