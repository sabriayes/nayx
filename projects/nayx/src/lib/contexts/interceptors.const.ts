import { HttpContextToken } from '@angular/common/http';

/**
 * HTTP çağrılarının context bilgisinde bu token yoksa **AuthInterceptor**
 * çağrı başlığını modifiye eder.
 * Bu kütüphane içerisindeki tüm HTTP çağrılarının context bilgisinde bu token
 * yer alır.
 */
export const IS_INTERCEPTORS_DISABLED: HttpContextToken<boolean> =
	new HttpContextToken<boolean>(() => true);
