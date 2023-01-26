import { inject, Injectable } from '@angular/core';
import { StorageService } from '@naylalabs/core/abstracts';
import { LOCAL_STORAGE } from '../tokens';

@Injectable()
export class LocalStorageService implements StorageService {
	private storage = inject<Storage>(LOCAL_STORAGE);

	set(key: string, value: string) {
		return this.storage.setItem(key, value);
	}

	get(key: string) {
		return this.storage.getItem(key);
	}

	remove(key: string) {
		this.storage.removeItem(key);
	}

	has(key: string): boolean {
		return !!this.get(key) ?? false;
	}

	clear() {
		this.storage.clear();
	}
}
