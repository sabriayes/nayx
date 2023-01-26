import { ModuleWithProviders, NgModule } from '@angular/core';
import {
	LocalStorageModule,
	LocalStorageService,
} from '@naylalabs/local-storage';
import {
	LocalAuthenticationModule,
	LocalAuthenticationService,
} from '@naylalabs/local-auth';
import {
	AuthTokensModule,
	AuthenticationTokensService,
} from '@naylalabs/auth-tokens';

@NgModule({
	imports: [
		LocalStorageModule.forRoot(),
		AuthTokensModule.forRoot(),
		LocalAuthenticationModule.forRoot(),
	],
})
export class NaylalabsModule {
	static forRoot(): ModuleWithProviders<NaylalabsModule> {
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
