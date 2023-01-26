import { HttpContextToken } from '@angular/common/http';

/**
 * HTTP çağrılarının context bilgisinde bu token varsa **AuthInterceptor**
 * çağrı başlığını modifiye eder.
 * Bu kütüphane içerisindeki tüm HTTP çağrılarının context bilgisinde bu token
 * yer alır.
 */
export const IS_INTERCEPTORS_ENABLED: HttpContextToken<boolean> =
	new HttpContextToken<boolean>(() => true);
