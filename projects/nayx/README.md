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

## 🚛 Local Storage Service

📦 `LocalStorageModule`\
👻 `StorageService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/local-storage/README.md)

Tarayıcı üzerinde veri depolamak için bu servisi kullanın.
`StorageService` soyut sınıfını kullanarak özelleştirilmiş depolama servisleri
kullanabilirsiniz.

## 💾 Memory Storage Service

📦 `MemoryStorageModule`\
👻 `StorageService`\
📒 [Servis Dokümanı](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/memory-storage/README.md)

InMemory yöntemi ile veri depolamak için bu servisi kullanın.
`StorageService` soyut sınıfını kullanarak özelleştirilmiş depolama servisleri
kullanabilirsiniz.

## 🌏 Window Injection Token

👻 `Window`\
📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/tokens/README.md)

Tarayıcının `window` nesnesine erişmek için **WINDOW** jetonunu kullanın.
`window` nesnesinin bulunamadığı durumlarda hata fırlatır.

## 🚚 Local Storage Injection Token

👻 `Storage`\
📒 [Doküman](https://github.com/sabriayes/nayx/tree/main/projects/nayx/src/lib/tokens/README.md)

Tarayıcının `localStorage`nesnesine erişmek için bu jetonu kullanın.
`window` nesnesinin bulunamadığı durumlarda hata fırlatır.

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