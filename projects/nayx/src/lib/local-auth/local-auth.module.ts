import { ModuleWithProviders, NgModule } from '@angular/core';
import { LocalAuthService } from '@nayx/core/abstracts';
import { LocalAuthenticationService } from './local-auth.service';
import { AuthTokensModule } from '@nayx/auth-tokens';
import { LocalStorageModule } from '@nayx/local-storage';

@NgModule({
	imports: [AuthTokensModule.forRoot(), LocalStorageModule.forRoot()],
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
