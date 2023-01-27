# 📚 Nayx
Naylalabs Web takımının **Angular** uygulamaları geliştirirken sıkça kullandığı
**Service, Interceptor, Guard, Token** bileşenlerini içerir. 
Tüm bileşenler **Angular 15** sürümü ile uyumlu olacak şekilde geliştirilmiştir.

Bu repo **Authentication, Token Storage, Local Storage** işlemleri için 
farklı servisler içermektedir. Entegrasyon ile ilgili bilgileri ve dikkat edilmesi 
gerekenleri aşağıdaki bölümde bulabilirsiniz.

## 🔐 Local Authentication Service

📦 `LocalAuthenticationModule`\
👻 `LocalAuthService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)

Kullanıcı adı ve parola temelli basit oturum açma işlemleri için bu servisi 
kullanın. `.signIn({...})` metodu farklı oturum açma işlemleri farklı arayüzler
içerir.

| Tip                        | Arayüz                       |
|----------------------------|------------------------------|
| **username - password**    | `CredentialsWithUsername`    |
| **email - password**       | `CredentialsWithEmail`       |
| **phoneNumber - password** | `CredentialsWithPhoneNumber` |

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
        this.authService.signIn(creds).subscribe(
            () => this.router.navigate(['/dashboard'])
        );
    }
}
```

## 📨 OTP Authentication Service

📦 `OTPAuthenticationModule`\
👻 `OTPAuthService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/otp-auth/README.md)

OTP temelli oturum açma işlemleri için bu servisi kullanın. `.signIn({...})` metodu 
farklı oturum açma işlemleri farklı arayüzler içerir ve istemciye yalnıza 
`otpToken` bilgisi döner. Oturum jetonlarını edinebilmek için `.verifyOTP({...})`
metodu ile süreci tamamlamanız gerekir.

| Tip             | Arayüz                          |
|-----------------|---------------------------------|
| **username**    | `OTPCredentialsWithUsername`    |
| **email**       | `OTPCredentialsWithEmail`       |
| **phoneNumber** | `OTPCredentialsWithPhoneNumber` |

`OTP_AUTH_SERVICE_OPTIONS` jetonu servis konfigürsayonlarını bağımlılık ağacına
aktarmanızı sağlar. Konfigürsayon tipi için bkz. `OTPAuthenticationServiceOptions`

### Entegrasyon

```ts
/**
 * Temel entegrasyon örneği. 
 * Konfügurasyon ve jeton saklamak için gereken bağımlıklar 
 * modül içerisinde mevcuttur.
 */
import { importProvidersFrom } from "@angular/core";
import { OTPAuthenticationModule } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            OTPAuthenticationModule
        )
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import {
    OTPAuthService, 
    BasicAuthResponse,
    OTPCredentialsWithEmail
} 
from "@sabriayes/nayx";

type User = Record<'firstName' | 'lastName', string>;
type SignInResponse = OTPAuthResponse;
type VerifyOTPResponse = BasicAuthResponse;

@Component({})
export class SignInPageComponent {
    router = inject(Router);
    authService = inject<
        OTPAuthService<User, SignInResponse, VerifyOTPResponse>
        >(OTPAuthService);

    /**
     * İlk adımda kullanıcı oturum açma isteği gönderir.
     * Cevap olarak OTP jetonunu alır, bu jeton servis tarafından
     * InMemory şekilde saklanır.
     */
    signIn(creds: OTPCredentialsWithEmail) {
        this.authService.signIn(creds).subscribe(
            () => this.router.navigate(['/otp'])
        );
    }
}

@Component({})
export class VeriyfOTPPageComponent {
    router = inject(Router);
    authService = inject<
        OTPAuthService<User, SignInResponse, VerifyOTPResponse>
        >(OTPAuthService);

    /**
     * İkinci adımda kullanıcı kendisine ulaştırılan OTP kodunu kullanarak
     * doğrulama yapar.
     * Cevap olarak oturum jetonlarını alır, bu jetonlar servis tarafından
     * tarayıcı deposunda saklanır. (Değişklik yapılmamış ise LocalStorage'da
     * saklanır)
     */
    verifyOTP() {
        const otpCode: string = '000000';
        this.authService.verifyOTP(otpCode).subscribe(
            () => this.router.navigate(['/dashboard'])
        );
    }
}
```

## 🔑 Authentication Tokens Service

📦 `AuthTokensModule`\
👻 `TokensService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/auth-tokens/README.md)

Oturum jetonlarını saklamak için bu servis kullanılır. `OTPAuthenticationModule`
ve `LocalAuthenticationModule`içerisinde varsayılan olarak bağımlılık ağacına
eklenmiştir. `TokensService` soyut sınıfını kullanarak özelleştirilmiş jeton servisleri
kullanabilirsiniz.

`AUTH_TOKENS_SERVICE_OTPIONS` jetonu servis konfigürsayonlarını bağımlılık ağacına
aktarmanızı sağlar.

### Entegrasyon

```ts
/**
 * {keys} jetonların hangi anahtarlar ile depolanacağını belirtir.
 * Bu örnekte ACCESS_TOKEN jetonu {access_token} anahtarı ile depolanır.
 * NOT: Depolama yöntemi StorageService soyut sınıfı tarafından sağlanır
 */
import { importProvidersFrom } from "@angular/core";
import { AUTH_TOKENS_SERVICE_OTPIONS, AuthTokensModule, AuthToken } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        {
            provide: AUTH_TOKENS_SERVICE_OTPIONS,
            useValue: {
                keys: {
                    [AuthToken.ACCESS_TOKEN]: 'access_token',
                    [AuthToken.REFRESH_TOKEN]: 'refresh_token',
                },
            }
        },
        importProvidersFrom(
            AuthTokensModule
        )
    ]
});
```

### Temel Kullanım

```ts
import {Component, inject } from "@angular/core";
import { TokensService } from "@sabriayes/nayx";

@Component({})
export class SomePageComponent implements OnInit {
    tokensService = inject<TokensService>(TokensService);
    
    ngOnInit() {
        const accessToken: string 
            = this.tokensService.get(AuthToken.ACCESS_TOKEN);
    }
}
```

## 🚛 Local Storage Service

📦 `LocalStorageModule`\
👻 `StorageService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-storage/README.md)

Tarayıcı üzerinde veri depolamak için bu servisi kullanın. 
`StorageService` soyut sınıfını kullanarak özelleştirilmiş depolama servisleri
kullanabilirsiniz.

### Entegrasyon

```ts
import { importProvidersFrom } from "@angular/core";
import { LocalStorageModule } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            LocalStorageModule
        )
    ]
});
```

### Temel Kullanım

```ts
import {Component, inject } from "@angular/core";
import { StorageService } from "@sabriayes/nayx";

@Component({})
export class SomePageComponent implements OnInit {
    storageServie = inject<StorageService>(StorageService);
    
    ngOnInit() {
        const username: string = this.storageServie.get('username');
    }
}
```

## 💾 Memory Storage Service

📦 `MemoryStorageModule`\
👻 `StorageService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/memory-storage/README.md)

InMemory yöntemi ile veri depolamak için bu servisi kullanın.
`StorageService` soyut sınıfını kullanarak özelleştirilmiş depolama servisleri
kullanabilirsiniz.

### Entegrasyon

```ts
import { importProvidersFrom } from "@angular/core";
import { MemoryStorageModule } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            MemoryStorageModule
        )
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from "@angular/core";
import { StorageService } from "@sabriayes/nayx";

@Component({})
export class SomePageComponent implements OnInit {
    storageServie = inject<StorageService>(StorageService);
    
    ngOnInit() {
        const username: string = this.storageServie.get('username');
    }
}
```

## 🌏 Window Injection Token

👻 `Window`\
📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/tokens/README.md)

Tarayıcının `window` nesnesine erişmek için **WINDOW** jetonunu kullanın.
`window` nesnesinin bulunamadığı durumlarda hata fırlatır.

### Temel Kullanım

```ts
import { Component, inject } from "@angular/core";
import { WINDOW } from "@sabriayes/nayx";

@Component({})
export class SomePageComponent {
    window = inject<Window>(WINDOW);
    
    openPage() {
        this.window.open('https://website.com');
    }
}
```

## 🚚 Local Storage Injection Token

👻 `Storage`\
📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/tokens/README.md)

Tarayıcının `localStorage`nesnesine erişmek için bu jetonu kullanın.
`window` nesnesinin bulunamadığı durumlarda hata fırlatır.

### Temel Kullanım

```ts
import { Component, inject } from "@angular/core";
import { LOCAL_STORAGE } from "@sabriayes/nayx";

@Component({})
export class SomePageComponent {
    storage = inject<Storage>(LOCAL_STORAGE);
    
    constructor () {
        this.storage.setItem('username', 'sabriayes');
    }
}
```

## 🚚 Auth Guard

📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/auth-guard/README.md)

`Route` erişimine kısıtlama getirmek için bu fonksiyonu kullanın. `TokensService`
bağımlılığını kullanarak oturum bilgisini kontrol eder. Oturum açılmamış ise
istenilen rotaya yönlendirme yapar.

```ts
const ROUTES = [
    {
        path: 'dashaboard',
        conmponent: DashboardPageComponent,
        canActivate: [
            authGuard(['/401'])
        ]
    },
    {
        path: 'required-some-props',
        conmponent: DashboardPageComponent,
        canActivate: [
            // Oturum onaylansa bile {hasPersonalInfo} anahtarı 
            // true olmak zorunda.
            authGuard(['/401'], ['hasPersonalInfo'])
        ]
    }
]
```

## 🚚 Auth Interceptor

📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/auth-interceptor/README.md)

Her `HttpClient` çağrısının`headers` bilgisinde oturum jetonları bulunsun
istiyorsanız bu fonksiyonu kullanın.

`IS_INTERCEPTORS_DISABLED` context bilgisinin true olduğu durumlarda bu fonksiyon
çalışmaz. `IS_INTERCEPTORS_DISABLED` context bilgisi bu paketteki tüm çarğrılarda varasyılan
olarak false olarak kullanılır.

https://angular.io/api/common/http/HttpContext

```ts
import { importProvidersFrom } from "@angular/core";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(
            withInterceptors([authInterceptor])
        )
    ]
});
```