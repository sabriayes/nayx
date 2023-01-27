import { AuthEndpoint } from '@nayx/core/enums';

export class EndpointError extends Error {
	constructor(endpoint: AuthEndpoint) {
		super(`This endpoint [${endpoint}] not found!`);
	}
}
