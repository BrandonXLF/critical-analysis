import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-calculation-row',
	templateUrl: './calculation-row.component.html'
})
export class CalculationRowComponent {
	@Input() value!: number;
	@Input() ratio!: number;
	@Input() multiplier!: number;
	@Input() efficiency!: number;
}
