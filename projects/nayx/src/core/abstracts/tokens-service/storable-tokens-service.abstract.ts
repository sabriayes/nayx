import { StorageService } from '@nayx/core/abstracts/storage-service';

export abstract class StorableTokensService {
	abstract storage: StorageService | null;
}
