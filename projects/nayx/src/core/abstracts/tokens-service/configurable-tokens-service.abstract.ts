import { TokensServiceOptions } from '@nayx/core/models';

export abstract class ConfigurableTokensService<
	T extends TokensServiceOptions,
> {
	abstract options: T;
}
