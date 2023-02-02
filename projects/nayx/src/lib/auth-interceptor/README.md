# Auth Interceptor

HTTP isteklerinin başlık içeriğinde oturum jetonlarını göndermek için
bu fonksyionu kullanın. `TokensService` bağımlılığını kullanarak oturum 
jetonlarına erişir.

`AuthToken.ACCESS_TOKEN` bilgisini çağrı başlığınına 
`Authorization: 'Bearer [ACCESS_TOKEN]'` **Bearer** stratejiye uygun biçimde 
ekler.

**ACCESS_TOKEN** bilgisine erişememiş ise çağrı başlığnı değştirmez.

```ts
/** @file main.ts 
 * 
 * Gönderilen HTTP isteğinin Header bilgisi.
 * {
 *      'Content-Type': 'application/json',
 *      'Authorization: 'Bearer ...',
 * }
 */

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "@sabriayes/nayx";

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
    ]
})
```

`IS_INTERCEPTOR_DISABLED` context ile yapılan çağrılarda bu interceptor çalışmaz.

```ts
import { HttpClient, HttpContext } from "@angular/common/http";
import { IS_INTERCEPTORS_DISABLED } from "@sabriayes/nayx";
import { Observable } from "rxjs";

/**
 * authInterceptor bu çağrı için çalışmaz!
 */
function fetchBooks(): Observable<Book[]> {
    const http = inhect(HttpClient);
    const context = new HttpContext()
        .set(IS_INTERCEPTORS_DISABLED, false);
    
    return http.get(PATH, { context });
}
```