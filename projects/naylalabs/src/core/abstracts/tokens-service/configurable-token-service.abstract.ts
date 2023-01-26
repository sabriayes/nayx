import { TokensServiceOptions } from '@naylalabs/core/models';

export abstract class ConfigurableTokensService<
	T extends TokensServiceOptions,
> {
	abstract options: T;
}
