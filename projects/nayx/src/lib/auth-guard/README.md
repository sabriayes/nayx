# Auth Guard

`Route` erişimine kısıtlama getirmek için bu fonksiyonu kullanın. `TokensService` ve `LocalAuthService`
bağımlılıklarını kullanarak oturum bilgisini kontrol eder. Oturum açılmamış ise
istenilen rotaya yönlendirme yapar.

İlgili rotanın `canActivate` veya `canLoad` dekoratörlerine ekleyin.

```ts
/** @file main.ts */

import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor, provideNayxLocalAuth } from "@sabriayes/nayx";
import { provideRouter } from "@angular/router";

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(ROUTES),
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
        provideNayxLocalAuth({ ... }),
    ]
})
```

```ts
/**
 *  @file routes.ts
 *  
 *  authGuard<T>(to: unknown[], validatorFunc?: AccountValidatorFunc: T): Observable<true>;
 *  @params to - Yönlendirme yapılacak UrlTree
 *  @params validatorFunc - Oturum açmış olan kullanıcı bilgisini bu fonksiyon 
 *                          ile doğrulayın
 */
const ROUTES = [
    {
        path: 'dashaboard',
        component: DashboardPageComponent,
        canActivate: [
            // Oturum başarısız ise 401 sayfasına yönlendirir
            authGuard(['/401'])
        ]
    },
    {
        path: 'required-some-props',
        component: DashboardPageComponent,
        canActivate: [
            // Oturum onaylansa bile {hasAddress} anahtarı 
            // true olmak zorunda
            authGuard(['/401'], (user: User) => !!user.hasAddress)
        ]
    }
]
```