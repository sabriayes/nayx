import { AuthServiceOptions } from '@nayx/core/models';
import { AuthEndpoint } from '@nayx/core/enums';

export abstract class ConfigurableAuthService<T extends AuthServiceOptions> {
	abstract options: T;
	abstract getEndpoint(endpoint: AuthEndpoint): string;
	abstract hasEndpoint(endpoint: AuthEndpoint): boolean;
}
