export type CredentialsWithUserName = {
	type: 'username';
	username: string;
	password: string;
};

export type CredentialsWithEmail = {
	type: 'email';
	email: string;
	password: string;
};

export type CredentialsWithPhoneNumber = {
	type: 'phoneNumber';
	phoneNumber: string;
	password: string;
};

export type SigninCredentials =
	| CredentialsWithUserName
	| CredentialsWithEmail
	| CredentialsWithPhoneNumber;

export type OTPSigninCredentials =
	| Omit<CredentialsWithUserName, 'password'>
	| Omit<CredentialsWithEmail, 'password'>
	| Omit<CredentialsWithPhoneNumber, 'password'>;
