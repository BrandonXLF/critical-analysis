import { Component } from '@angular/core';
import { CritInfo } from './crit-info';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	critInfo = new CritInfo(0.05, 0.5)
}
