# 📚 Nayx
Naylalabs Web takımının **Angular** uygulamaları geliştirirken sıkça kullandığı
**Service, Interceptor, Guard, Token** bileşenlerini içerir. 
Tüm bileşenler **Angular 15** sürümü ile uyumlu olacak şekilde geliştirilmiştir.

## Servisler
Bu repo **Authentication, Token Storage, Local Storage** işlemleri için 
farklı servisler içermektedir. Entegrasyon ile ilgili bilgileri ve dikkat edilmesi 
gerekenleri aşağıdaki bölümde bulabilirsiniz.

### 🔒 Local Authentication Service

👻 `LocalAuthService`\
📒 [README](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)

Kullanıcı adı ve parola temelli basit oturum açma işlemleri için bu servisi 
kullanın. `.signIn({...})` metodu farklı oturum açma işlemleri farklı arayüzler
içerir.\

| Tip                      | Arayüz                     |
|--------------------------|----------------------------|
| `username - password`    | CredentialsWithUsername    |
| `email - password`       | CredentialsWithEmail       |
| `phoneNumner - password` | CredentialsWithPhoneNumber |

`LOCAL_AUTH_SERVICE_OPTIONS` jetonu servis konfigürsayonlarını bağımlılık ağacına
aktarmanızı sağlar. Konfigürsayon tipi için bkz. `LocalAuthenticationServiceOptions`\

#### Entegrasyon

```ts
/**
 * Temel kullanım örneği. 
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

```ts
/**
 * Konfigüre edilmiş kullanım örneği. 
 * LOCAL_AUTH_SERVICE_OPTIONS jetonu ile servis ayarları 
 * içeri aktarılır.
 */
import { importProvidersFrom } from "@angular/core";
import {
    AuthEndpoint,
    LocalAuthenticationModule,
    LOCAL_AUTH_SERVICE_OPTIONS,
    LocalAuthenticationServiceOptions,
} from '@sabriayes/nayx';

const SERVICE_OPTIONS: LocalAuthenticationServiceOptions = {
    retryLimit: 1,
    baseURL: 'https://api.backend.com',
    endpoins: {
        [AuthEndpoint.SIGN_IN]: 'auth/signin', // POST
        [AuthEndpoint.SIGN_OUT]: 'auth/signout', // DELETE
        [AuthEndpoint.VERIFY_ACCOUNT]: 'auth/me', // GET
    }
}
bootstrapApplication(AppComponent, {
    providers: [
        {
            provide: LOCAL_AUTH_SERVICE_OPTIONS,
            useValue: SERVICE_OPTIONS
        },
        importProvidersFrom(
            LocalAuthenticationModule
        )
    ]
});
```

#### Temel Kullanım

```ts
import { Component, inject } from "@angular/core";
import { LocalAuthService, BasicAuthResponse } from "@sabriayes/nayx";

type User = Record<'firstName' | 'lastName', string>;
type SignInResponse = BasicAuthResponse;

@Component({})
export class SignInPageComponent {
    authService = inject<LocalAuthService<User, SignInResponse>>(LocalAuthService);

    signIn() {
        const credentials = {
            _kind: 'username',
            username: 'sabriayes',
            password: '**********'
        };
        
        this.signIn(credentials).subscribe((user: User) => {
            console.log(user);
        });
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