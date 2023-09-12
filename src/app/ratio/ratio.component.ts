import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-ratio',
	templateUrl: './ratio.component.html'
})
export class RatioComponent {
	@Input() name?: string;
	@Input() value?: number;
}
