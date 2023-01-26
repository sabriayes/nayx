export class NullInjectionError extends Error {
	constructor(name: string) {
		super(`This source (${name}) is not provided!`);
	}
}
