import { inject, Injectable } from '@angular/core';
import { StorageService } from '@nayx/core/abstracts';
import { LOCAL_STORAGE } from '@nayx/tokens';

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
