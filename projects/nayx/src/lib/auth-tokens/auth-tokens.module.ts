import { ModuleWithProviders, NgModule } from '@angular/core';
import { TokensService } from '@nayx/core/abstracts';
import { AuthenticationTokensService } from './auth-tokens.service';

@NgModule({
	providers: [
		{
			provide: TokensService,
			useClass: AuthenticationTokensService,
		},
	],
})
export class AuthTokensModule {
	static forRoot(): ModuleWithProviders<AuthTokensModule> {
		return {
			ngModule: AuthTokensModule,
			providers: [AuthenticationTokensService],
		};
	}
}
