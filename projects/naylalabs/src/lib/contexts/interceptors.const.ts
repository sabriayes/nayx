import { HttpContextToken } from '@angular/common/http';

export const IS_INTERCEPTORS_ENABLED: HttpContextToken<boolean> =
	new HttpContextToken<boolean>(() => true);
