import { Component } from '@angular/core';
import calcs from './../calcs.html';

@Component({
	selector: 'app-calculations',
	templateUrl: './calculations.component.html',
	styleUrls: ['./calculations.component.scss']
})
export class CalculationsComponent {
	calcs = calcs;
}
