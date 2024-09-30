import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-percentage',
	templateUrl: './percentage.component.html',
	styleUrls: ['./percentage.component.scss']
})
export class PercentageComponent {
	@Input() name?: string;
	@Input() value?: number;
}
