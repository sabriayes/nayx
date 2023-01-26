import { Injectable } from '@angular/core';
import { StorageService } from '@naylalabs/core/abstracts';

@Injectable()
export class MemoryStorageService implements StorageService {
	private readonly storage: Map<string, string> = new Map();

	set(key: string, value: string) {
		return this.storage.set(key, value);
	}

	get(key: string) {
		return this.storage.get(key);
	}

	remove(key: string) {
		this.storage.delete(key);
	}

	has(key: string) {
		return this.storage.has(key);
	}

	clear() {
		this.storage.clear();
	}
}
