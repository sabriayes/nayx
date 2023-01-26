import { ModuleWithProviders, NgModule } from '@angular/core';
import { StorageService } from '@nayx/core/abstracts';
import { MemoryStorageService } from './memory-storage.service';

@NgModule({
	providers: [
		{
			provide: StorageService,
			useClass: MemoryStorageService,
		},
	],
})
export class MemoryStorageModule {
	static forRoot(): ModuleWithProviders<MemoryStorageModule> {
		return {
			ngModule: MemoryStorageModule,
			providers: [MemoryStorageService],
		};
	}
}
