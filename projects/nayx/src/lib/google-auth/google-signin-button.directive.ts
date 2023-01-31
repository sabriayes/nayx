/// <reference types="google.accounts" />

import {
	Directive,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	Output,
	Renderer2,
} from '@angular/core';
import { GoogleAuthService } from '@nayx/core/index';
import { filter, take } from 'rxjs';

type Type = 'icon' | 'standard';
type Size = 'small' | 'medium' | 'large';
type Text = 'signin_with' | 'signup_with';
type Shape = 'square' | 'circle' | 'pill' | 'rectangular';
type Theme = 'outline' | 'filled_blue' | 'filled_black';
type LogoAlignment = 'left' | 'center';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: 'nayx-google-signin-btn',
	standalone: true,
})
export class GoogleSigninButtonDirective {
	private readonly renderer2 = inject(Renderer2);

	@Output() buttonClick = new EventEmitter<void>();

	@Input() type: Type = 'icon';
	@Input() size: Size = 'large';
	@Input() text: Text = 'signin_with';
	@Input() shape: Shape = 'circle';
	@Input() theme: Theme = 'outline';
	@Input() logoAlignment: LogoAlignment = 'center';
	@Input() width: string = '';
	@Input() locale: string = '';

	constructor() {
		const { nativeElement } = inject(ElementRef);
		const googleAuthService = inject(GoogleAuthService, { optional: true });

		googleAuthService?.init$
			.pipe(filter(Boolean), take(1))
			.subscribe(() => {
				google.accounts.id.renderButton(nativeElement, {
					type: this.type,
					size: this.size,
					text: this.text,
					width: this.width,
					shape: this.shape,
					theme: this.theme,
					logo_alignment: this.logoAlignment,
					locale: this.locale,
					click_listener: () => this.buttonClick.emit(),
				});
			});
	}
}
