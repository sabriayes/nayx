# 📚 Nayx
Naylalabs Web takımının **Angular** uygulamaları geliştirirken sıkça kullandığı
**Service, Interceptor, Guard, Token** bileşenlerini içerir. 
Tüm bileşenler **Angular 15** sürümü ile uyumlu olacak şekilde geliştirilmiştir.

Bu repo **Authentication, Token Storage, Local Storage** işlemleri için 
farklı servisler içermektedir. Entegrasyon ile ilgili bilgileri ve dikkat edilmesi 
gerekenleri aşağıdaki bölümde bulabilirsiniz.

## 🔐 Local Authentication Service

👻 `LocalAuthService`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)

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

👻 `OTPAuthService`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/otp-auth/README.md)

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

👻 `TokensService`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/auth-tokens/README.md)

Oturum jetonlarını saklamak için bu servis kullanılır. `OTPAuthenticationModule`
ve `LocalAuthenticationModule`içerisinde varsayılan olarak bağımlılık ağacına
eklenmiştir. `TokensService` soyut sınıfını kullanarak özelleştirilmiş jeton servisleri
kullanabilirsiniz.

`AUTH_TOKENS_SERVICE_OTPIONS` jetonu servis konfigürsayonlarını bağımlılık ağacına
aktarmanızı sağlar.

```ts
/**
 * {keys} jetonların hangi anahtarlar ile depolanacağını belirtir.
 * ACCESS_TOKEN jetonu `access_token` anahtarı ile depolanır.
 * NOT: Depolama yöntemi StorageService soyut sınıfı tarafından sağlanır
 */
import { importProvidersFrom } from "@angular/core";
import { AUTH_TOKENS_SERVICE_OTPIONS, AuthToken } from '@sabriayes/nayx';

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
        }
    ]
});
```

## 🚛 Local Storage Service

👻 `StorageService`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)

## 💾 Memory Storage Service

👻 `StorageService`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)


## 🌏 WINDOW Injection Token

👻 `Window`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)

## 🚚 Local Storage Injection Token

👻 `Storage`\
📒 [Service Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-auth/README.md)