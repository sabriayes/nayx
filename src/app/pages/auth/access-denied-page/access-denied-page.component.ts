import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'app-access-denied-page',
	standalone: true,
	templateUrl: './access-denied-page.component.html',
	styleUrls: ['./access-denied-page.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessDeniedPageComponent {}
