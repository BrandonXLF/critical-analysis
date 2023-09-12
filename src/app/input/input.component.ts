import { EventEmitter, Component, Input, Output } from '@angular/core';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss']
})
export class InputComponent {
	static PRECISION = 1000;

	@Input() name?: string;
	@Input() value: number = 0;
	@Input() min: number = -Infinity;

	@Output() valueChange = new EventEmitter<number>();

	updateValue(e: Event) {
		const el = e.target as HTMLInputElement;

		this.valueChange.emit(Math.max(this.min, el.valueAsNumber / 100));
	}

	get displayValue() {
		return Math.round(this.value * 100 * InputComponent.PRECISION) / InputComponent.PRECISION;
	}
}
