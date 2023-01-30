import { BasicAuthResponse } from '@nayx/core/models';
import { SocialAuthService } from '@nayx/core/abstracts/auth-service';

export abstract class GoogleAuthService<
	T,
	R extends BasicAuthResponse,
> extends SocialAuthService<T, R> {}
