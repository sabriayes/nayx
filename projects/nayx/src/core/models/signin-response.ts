export type BasicAuthResponse = {
	accessToken: string;
	refreshToken: string;
};

export type OTPAuthResponse = {
	otpToken: string;
};

export type SignInResponses = BasicAuthResponse | OTPAuthResponse;
