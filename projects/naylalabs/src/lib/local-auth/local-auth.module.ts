import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalAuthService } from '@naylalabs/core/abstracts';
import { LocalAuthenticationService } from './local-auth.service';

@NgModule({
	providers: [
		{
			provide: LocalAuthService,
			useClass: LocalAuthenticationService,
		},
	],
})
export class LocalAuthenticationModule {
	static forRoot(): ModuleWithProviders<LocalAuthenticationModule> {
		return {
			ngModule: LocalAuthenticationModule,
			providers: [LocalAuthenticationService],
		};
	}
}
