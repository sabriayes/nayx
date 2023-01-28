export abstract class ProvideAuthService {
	abstract appendScript(
		document: Document,
		uniqId: string,
		scriptURL: string,
	): Promise<null>;
}
