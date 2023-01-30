/// <reference types="google.accounts" />
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-sing-in-page',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './sing-in-page.component.html',
	styleUrls: ['./sing-in-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingInPageComponent {}
