import { inject, Injectable } from '@angular/core';
import {
	ConfigurableTokensService,
	StorableTokensService,
	StorageService,
	TokensService,
} from '@nayx/core/abstracts';
import { AuthToken } from '@nayx/core/enums';
import { AUTH_TOKENS_SERVICE_OPTIONS } from './options.const';
import { AuthenticationTokensServiceOptions } from './options.interface';

@Injectable()
export class AuthenticationTokensService
	implements
		TokensService,
		StorableTokensService,
		ConfigurableTokensService<AuthenticationTokensServiceOptions>
{
	public options = inject<AuthenticationTokensServiceOptions>(
		AUTH_TOKENS_SERVICE_OPTIONS,
	);
	public storage = inject<StorageService>(StorageService);

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
