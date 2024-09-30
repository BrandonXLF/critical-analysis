import { Component } from '@angular/core';
import math from './../math.html';

@Component({
	selector: 'app-equations',
	templateUrl: './equations.component.html',
	styleUrls: ['./equations.component.scss']
})
export class EquationsComponent {
	math = math;
}
