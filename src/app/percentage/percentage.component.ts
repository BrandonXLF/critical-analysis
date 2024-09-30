import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-percentage',
	templateUrl: './percentage.component.html'
})
export class PercentageComponent {
	@Input() name?: string;
	@Input() value?: number;
}
