import { StorageService } from '@naylalabs/core/abstracts/storage-service';

export abstract class StorableTokensService {
	abstract storage: StorageService | null;
}
