import { ModuleWithProviders, NgModule } from '@angular/core';
import { StorageService } from '@nayx/core/abstracts';
import { LocalStorageService } from './local-storage.service';

@NgModule({
	providers: [
		{
			provide: StorageService,
			useClass: LocalStorageService,
		},
	],
})
export class LocalStorageModule {
	static forRoot(): ModuleWithProviders<LocalStorageModule> {
		return {
			ngModule: LocalStorageModule,
			providers: [LocalStorageService],
		};
	}
}
