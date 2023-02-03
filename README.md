# 📚 Nayx
Naylalabs Web takımının **Angular** uygulamaları geliştirirken sıkça kullandığı
**Service, Interceptor, Guard, Token** bileşenlerini içerir. 
Tüm bileşenler **Angular 15** sürümü ile uyumlu olacak şekilde geliştirilmiştir.

Bu repo **Authentication, Token Storage, Local Storage** işlemleri için 
farklı servisler içermektedir. Entegrasyon ile ilgili bilgileri ve dikkat edilmesi 
gerekenleri aşağıdaki bölümde bulabilirsiniz.

## 🔐 Local Authentication Service

📦 `provideNayxLocalAuth`\
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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNayxLocalAuth, authInterceptor } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideNayxLocalAuth({
            baseURL: 'https://api.backend.com'
        }),
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    LocalAuthService, 
    BasicAuthResponse, 
    CredentialsWithEmail
} 
from '@sabriayes/nayx';

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

📦 `provideNayxOTPAuth`\
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
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNayxLocalAuth, authInterceptor } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideNayxOTPAuth({
            baseURL: 'https://api.backend.com'
        }),
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
    OTPAuthService, 
    BasicAuthResponse,
    OTPCredentialsWithEmail
} 
from '@sabriayes/nayx';

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

## 🔑 Google Authentication Service

📦 `provideNayxGoogleAuth`\
👻 `GoogleAuthService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/google-auth/README.md)

Google Auth API ile oturum açma işlemleri için bu servisi kullanın. 
`.signIn({...})` metodunu bu servis ile kullanamazsınız. Google Sign-In Button
için `<nayx-google-signin-button>` bileşenin kullanın.

`GOOGLE_AUTH_SERVICE_OPTIONS` jetonu servis konfigürsayonlarını bağımlılık ağacına
aktarmanızı sağlar. Konfigürsayon tipi için bkz. `GoogleAuthenticationServiceOptions`

### Entegrasyon

```ts
import { provideNayxGoogleAuth } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideNayxGoogleAuth({
            id: 'GOOGLE_CLIENT_ID',
            scopes: ['email', 'profile'],
            baseURL: 'https://api.backend.com'
        })
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleAuthService } from '@sabriayes/nayx';
import { filter } from 'rxjs';

@Component({
    selector: 'app-login-page',
    template: `<nayx-google-sigin-button></nayx-google-singin-button>`
})
export class LoginPageComponent implements OnInit {
    router = inject(Router);
    googleAuthService = inject<GoogleAuthService>(GoogleAuthService);

    ngOnInit() {
        this.googleAuthService.in$.pipe(filter(Boolean)).subscribe(
            () => this.router.navigate(['/dashboard'])
        );
    }
}
```

## 🔑 Facebook Authentication Service

📦 `provideNayxFacebookAuth`\
👻 `FacebookAuthService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/facebook-auth/README.md)

Facebook JS SDK ile oturum açma işlemleri için bu servisi kullanın.
`.emitSigIn()` metodunu ile giriş işlemini başlatabilirsiniz.

`FACEBOOK_AUTH_SERVICE_OPTIONS` jetonu servis konfigürsayonlarını bağımlılık ağacına
aktarmanızı sağlar. Konfigürsayon tipi için bkz. `FacebookAuthenticationServiceOptions`

### Entegrasyon

```ts
import { provideNayxFacebookAuth } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideNayxFacebookAuth({
            id: 'FACEBOOK_APP_ID',
            scopes: ['email', 'basic_profile'],
            baseURL: 'https://api.backend.com'
        })
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookAuthService } from '@sabriayes/nayx';
import { filter } from 'rxjs';

@Component({})
export class LoginPageComponent implements OnInit {
    router = inject(Router);
    facebookAuthService = inject<FacebookAuthService>(FacebookAuthService);
    
    signIn = () => this.facebookAuthService.emitSignIn();

    ngOnInit() {
        this.facebookAuthService.in$.pipe(filter(Boolean)).subscribe(
            () => this.router.navigate(['/dashboard'])
        );
    }
}
```

## 🔑 Authentication Tokens Service

📦 `provideNayxAuthTokens`\
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
import { provideNayxAuthTokens, AuthToken } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideNayxAuthTokens({
            keys: {
                [AuthToken.ACCESS_TOKEN]: 'access_token',
                [AuthToken.REFRESH_TOKEN]: 'refresh_token',
            },
        })
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from '@angular/core';
import { TokensService } from '@sabriayes/nayx';

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

📦 `provideNayxLocalStorage`\
👻 `StorageService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-storage/README.md)

Tarayıcı üzerinde veri depolamak için bu servisi kullanın. 
`StorageService` soyut sınıfını kullanarak özelleştirilmiş depolama servisleri
kullanabilirsiniz.

### Entegrasyon

```ts
import { providerNayxLocalStorage } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        providerNayxLocalStorage()
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from '@angular/core';
import { StorageService } from '@sabriayes/nayx';

@Component({})
export class SomePageComponent implements OnInit {
    storageServie = inject<StorageService>(StorageService);
    
    ngOnInit() {
        const username: string = this.storageServie.get('username');
    }
}
```

## 💾 Memory Storage Service

📦 `provideNayxMemoryStorage`\
👻 `StorageService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/memory-storage/README.md)

InMemory yöntemi ile veri depolamak için bu servisi kullanın.
`StorageService` soyut sınıfını kullanarak özelleştirilmiş depolama servisleri
kullanabilirsiniz.

### Entegrasyon

```ts
import { provideNayxMemoryStorage } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideNayxMemoryStorage()
    ]
});
```

### Temel Kullanım

```ts
import { Component, inject } from '@angular/core';
import { StorageService } from '@sabriayes/nayx';

@Component({})
export class SomePageComponent implements OnInit {
    storageServie = inject<StorageService>(StorageService);
    
    ngOnInit() {
        const username: string = this.storageServie.get('username');
    }
}
```


## ❌ Permission Service

📦 `provideNayxPermissions`\
👻 `PermissionsService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/permissions/README.md)

Rota erişimlerine yetkilendirme tabanlı kısıtlama getirmek için bu serivisi ve 
`Guard` fonksiyonlarını kullanın.

### Entegrasyon

```ts
import { APP_INITIALIZER, inject } from '@angular/core';
import { provideNayxPermissions } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideNayxPermissions({
            redirectTo: ['/access-denied'],
        }),
        {
            provide: APP_INITIALIZER,
            useFactory: () => {
                const permissionsService = inject(PermissionsService);
                return () =>
                    /**
                     *  .importLazy() - Yetkileri uzak sunucudan yükler
                     *  .import([]] - Yetkileri manuel yükler
                     */
                    permissionsService.import([
                        {
                            scope: 'accounts',
                            grants: { hasAccess: true, hasRead: true },
                        },
                        {
                            scope: 'reports',
                            grants: { hasAccess: true, hasRead: true },
                        },
                        {
                            scope: 'subscriptions',
                            grants: { 
                                hasAccess: true,
                                hasCreate: true,
                                hasRead: true,
                            },
                        },
                    ]);
            },
            multi: true,
            deps: [PermissionsService],
        },
    ]
});
```

### Temel Kullanım

```ts
import { permissionEveryGuard } from './permission-every.guard';
import { hasAccess, hasCreate } from './permission-validators';

/**
 * permissionEveryGuard - Tüm yetki kontollerinin olumlu sonuç dönmesini bekler
 * permissionAnyGuard - En az bir yetki kontolünün olumlu sonuç dönmesini bekler
 * permissionExceptGuard - Tüm yetki kontollerinin olumsuz sonuç dönmesini bekler
 */

const ROUTES = [
    {
        path: 'account-management',
        component: AccountManagementPageComponent,
        canActivate: [
            // Accounts ve Subscriptions alanlarınnda erişim yetkisi varsa.
            permissionEveryGuard('accounts', 'subscriptions')
        ]
    },
    {
        path: 'subscriptions',
        component: SubscriptionPageComponent,
        canActivate: [
            // Reports ve Subscriptions alanlarının herhangi birinde erişim 
            // yetkisi varsa.
            permissionAnyGuard('reports', 'subscriptions')
        ]
    },
    {
        path: 'subscriptions',
        component: SubscriptionPageComponent,
        canActivate: [
            // Reports oluşturma ve Subscriptions okuma işlemleri 
            // için yetki varsa.
            permissionAnyGuard(
                hasRead('subscriptions'),
                hasCreate('reports')
            )
        ]
    }
]
```

## 🌏 Window Injection Token

👻 `Window`\
📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/tokens/README.md)

Tarayıcının `window` nesnesine erişmek için **WINDOW** jetonunu kullanın.
`window` nesnesinin bulunamadığı durumlarda hata fırlatır.

### Temel Kullanım

```ts
import { Component, inject } from '@angular/core';
import { WINDOW } from '@sabriayes/nayx';

@Component({})
export class SomePageComponent {
    window = inject<Window>(WINDOW);
    
    openPage() {
        this.window.open('https://website.com');
    }
}
```

## 🪙 Local Storage Injection Token

👻 `Storage`\
📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/tokens/README.md)

Tarayıcının `localStorage`nesnesine erişmek için bu jetonu kullanın.
`window` nesnesinin bulunamadığı durumlarda hata fırlatır.

### Temel Kullanım

```ts
import { Component, inject } from '@angular/core';
import { LOCAL_STORAGE } from '@sabriayes/nayx';

@Component({})
export class SomePageComponent {
    storage = inject<Storage>(LOCAL_STORAGE);
    
    constructor () {
        this.storage.setItem('username', 'sabriayes');
    }
}
```

## ✋ Auth Guard

📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/auth-guard/README.md)

`Route` erişimine kısıtlama getirmek için bu fonksiyonu kullanın. `TokensService`
bağımlılığını kullanarak oturum bilgisini kontrol eder. Oturum açılmamış ise
istenilen rotaya yönlendirme yapar.

```ts
const ROUTES = [
    {
        path: 'dashaboard',
        component: DashboardPageComponent,
        canActivate: [
            authGuard(['/401'])
        ]
    },
    {
        path: 'required-some-props',
        component: DashboardPageComponent,
        canActivate: [
            // Oturum onaylansa bile {hasAddress} anahtarı 
            // true olmak zorunda.
            authGuard(['/401'], (user: User) => !!user.hasAddress)
        ]
    }
]
```

## 📝 Auth Interceptor

📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/auth-interceptor/README.md)

Her `HttpClient` çağrısının`headers` bilgisinde oturum jetonları bulunsun
istiyorsanız bu fonksiyonu kullanın.

`IS_INTERCEPTORS_DISABLED` context bilgisinin true olduğu durumlarda bu fonksiyon
çalışmaz. `IS_INTERCEPTORS_DISABLED` context bilgisi bu paketteki tüm çarğrılarda varasyılan
olarak false olarak kullanılır.

https://angular.io/api/common/http/HttpContext

```ts
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from '@sabriayes/nayx';

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(
            withInterceptors([authInterceptor])
        )
    ]
});
```