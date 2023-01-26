# 📚 Nayx
Naylalabs Web takımının **Angular** uygulamaları geliştirirken sıkça kullandığı
**Service, Interceptor, Guard, Token** bileşenlerini içerir. 
Tüm bileşenler **Angular 15** sürümü ile uyumlu olacak şekilde geliştirilmiştir.

Bu repo **Authentication, Token Storage, Local Storage** işlemleri için 
farklı servisler içermektedir. Entegrasyon ile ilgili bilgileri ve dikkat edilmesi 
gerekenleri aşağıdaki bölümde bulabilirsiniz.

## 🔒 Local Authentication Service

👻 `LocalAuthService`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)

Kullanıcı adı ve parola temelli basit oturum açma işlemleri için bu servisi 
kullanın. `.signIn({...})` metodu farklı oturum açma işlemleri farklı arayüzler
içerir.

| Tip                        | Arayüz                       |
|----------------------------|------------------------------|
| **username - password**    | `CredentialsWithUsername`    |
| **email - password**       | `CredentialsWithEmail`       |
| **phoneNumner - password** | `CredentialsWithPhoneNumber` |

`LOCAL_AUTH_SERVICE_OPTIONS` jetonu servis konfigürsayonlarını bağımlılık ağacına
aktarmanızı sağlar. Konfigürsayon tipi için bkz. `LocalAuthenticationServiceOptions`

### Entegrasyon

```ts
/**
 * Temel entegrasyon örneği. 
 * Konfügurasyon ve jeton saklamak için gereken bağımlıklar 
 * modül içerisinde mevcuttur.
 */
import { importProvidersFrom } from "@angular/core";
import { LocalAuthenticationModule } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            LocalAuthenticationModule
        )
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    LocalAuthService, 
    BasicAuthResponse, 
    CredentialsWithEmail
} 
from "@sabriayes/nayx";

type User = Record<'firstName' | 'lastName', string>;
type SignInResponse = BasicAuthResponse;

@Component({})
export class SignInPageComponent {
    router = inject(Router);
    authService = inject<LocalAuthService<User, SignInResponse>>(LocalAuthService);

    signIn(creds: CredentialsWithEmail) {
        this.signIn(creds).subscribe(
            () => this.router.navigate['/dashbaord']
        );
    }
}
```

### OTPAuthenticationService 
`<OTPAuthService>`

### AuthTokensService
`<TokensService>`

### LocalStorageService
`<StorageService>`

### MemoryStorageService
`<StorageService>`

## Injection Tokens
You can see all the services in this repository below.

### WINDOW
`<Window>`

### LOCAL_STORAGE
`<Storage>`

## Interceptors
You can see all the services in this repository below.

### authInterceptor

## Guards
You can see all the services in this repository below.

### authGuard