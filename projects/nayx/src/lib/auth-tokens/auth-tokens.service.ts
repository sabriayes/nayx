import { inject, Injectable } from '@angular/core';
import {
	ConfigurableTokensService,
	StorableTokensService,
	StorageService,
	TokensService,
	AuthToken,
} from '@nayx/core/index';
import {
	AUTH_TOKENS_SERVICE_OPTIONS,
	AuthenticationTokensServiceOptions,
} from './options.const';

@Injectable()
export class AuthenticationTokensService
	implements
		TokensService,
		StorableTokensService,
		ConfigurableTokensService<AuthenticationTokensServiceOptions>
{
	public storage = inject<StorageService>(StorageService);
	public options = inject<AuthenticationTokensServiceOptions>(
		AUTH_TOKENS_SERVICE_OPTIONS,
	);

	set(type: AuthToken, value: string) {
		return this.storage.set(this.options.keys[type], value);
	}

	get(type: AuthToken) {
		return this.storage.get(this.options.keys[type]) || undefined;
	}

	remove(type: AuthToken) {
		return this.storage.remove(this.options.keys[type]);
	}

	clear() {
		return Object.values(AuthToken).forEach(this.remove);
	}
}
