import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalStorageModule, LocalStorageService } from '@nayx/local-storage';
import {
	LocalAuthenticationModule,
	LocalAuthenticationService,
} from '@nayx/local-auth';
import {
	AuthTokensModule,
	AuthenticationTokensService,
} from '@nayx/auth-tokens';

@NgModule({
	imports: [
		LocalStorageModule.forRoot(),
		AuthTokensModule.forRoot(),
		LocalAuthenticationModule.forRoot(),
	],
})
export class NayxModule {
	static forRoot(): ModuleWithProviders<NayxModule> {
		return {
			ngModule: LocalAuthenticationModule,
			providers: [
				LocalAuthenticationService,
				LocalStorageService,
				AuthenticationTokensService,
			],
		};
	}
}
