export abstract class StorageService {
	public abstract get(key: string): string | null | undefined;
	public abstract set(key: string, value: string): void;
	public abstract remove(key: string): void;
	public abstract clear(): void;
	public abstract has(key: string): boolean;
}
