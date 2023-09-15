import { Component, Input } from '@angular/core';
import { CritInfo } from '../crit-info';

@Component({
	selector: 'app-calculator',
	templateUrl: './calculator.component.html',
	styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent {
	@Input() critInfo!: CritInfo;
}
