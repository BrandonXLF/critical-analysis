import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-output',
	templateUrl: './output.component.html',
	styleUrls: ['./output.component.scss']
})
export class OutputComponent {
	@Input() name?: string;
	@Input() tooltip: string = '';
}

