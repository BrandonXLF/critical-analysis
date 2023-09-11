import calcs from './calcs.html';

import { Component } from '@angular/core';
import { CritInfo } from './crit-info';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
	calcs = calcs;
  	critInfo = new CritInfo(0.05, 0.5)
}
