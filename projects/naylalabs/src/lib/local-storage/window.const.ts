import { InjectionToken, inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { NullInjectionError } from '@naylalabs/core/errors';

export const WINDOW = new InjectionToken<Window>('WINDOW', {
	factory: () => {
		const platformId = inject<object>(PLATFORM_ID);
		if (!isPlatformBrowser(platformId)) {
			throw new Error('Runtime environment is not browser');
		}

		const document = inject<Document>(DOCUMENT);
		if (!document.defaultView) {
			throw new NullInjectionError('Window|WindowConst');
		}

		return document.defaultView;
	},
});
