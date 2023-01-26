import { ModuleWithProviders, NgModule } from '@angular/core';
import { OTPAuthService } from '@nayx/core/abstracts';
import { OTPAuthenticationService } from './otp-auth.service';

@NgModule({
	providers: [
		{
			provide: OTPAuthService,
			useClass: OTPAuthenticationService,
		},
	],
})
export class OTPAuthenticationModule {
	static forRoot(): ModuleWithProviders<OTPAuthenticationModule> {
		return {
			ngModule: OTPAuthenticationModule,
			providers: [OTPAuthenticationService],
		};
	}
}
