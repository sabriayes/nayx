import { BasicAuthResponse } from '@nayx/core/models';
import { SocialAuthService } from '@nayx/core/abstracts/auth-service';

export abstract class FacebookAuthService<
	T,
	R extends BasicAuthResponse,
> extends SocialAuthService<T, R> {
	abstract emitSignIn(): void;
}
