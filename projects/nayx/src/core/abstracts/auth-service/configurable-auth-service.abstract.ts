import { AuthServiceOptions } from '@nayx/core/models';
import { AuthEndpoint } from '@nayx/core/enums';

export abstract class ConfigurableAuthService<T extends AuthServiceOptions> {
	abstract options: T;

	public getEndpoint(endpoint: AuthEndpoint): string {
		const foundEndpoint = this.options.endpoints[endpoint];
		if (!foundEndpoint) {
			throw new Error(`[${endpoint}] endpoint not found in auth options`);
		}
		return `${this.options.baseURL}/${foundEndpoint}`;
	}
}
