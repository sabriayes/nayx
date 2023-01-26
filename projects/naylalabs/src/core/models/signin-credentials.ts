export type CredentialsWithUserName = {
	_kind?: 'username';
	username: string;
	password: string;
};

export type CredentialsWithEmail = {
	_kind?: 'email';
	email: string;
	password: string;
};

export type CredentialsWithPhoneNumber = {
	_kind?: 'phoneNumber';
	phoneNumber: string;
	password: string;
};

export type SigninCredentials =
	| CredentialsWithUserName
	| CredentialsWithEmail
	| CredentialsWithPhoneNumber;
