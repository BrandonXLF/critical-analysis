import { EventEmitter, Component, Input, Output } from '@angular/core';

@Component({
	selector: 'app-input',
	templateUrl: './input.component.html',
	styleUrls: ['./input.component.scss']
})
export class InputComponent {
	@Input() name?: string;
	@Input() value?: number;

	@Output() valueChange = new EventEmitter<number>();

	updateValue(e: Event) {
		const el = e.target as HTMLInputElement;

		this.valueChange.emit(el.valueAsNumber / 100);
	}
}
