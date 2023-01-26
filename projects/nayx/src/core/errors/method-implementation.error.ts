export class MethodImplementationError extends Error {
	constructor(methodName: string) {
		super(`This method (${methodName}) is not implemented yet!`);
	}
}
