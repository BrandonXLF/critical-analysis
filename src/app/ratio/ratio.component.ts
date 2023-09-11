import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ratio',
  templateUrl: './ratio.component.html',
  styleUrls: ['./ratio.component.less']
})
export class RatioComponent {
  @Input() name?: string;
  @Input() value?: number;
}
