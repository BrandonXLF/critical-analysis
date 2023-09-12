import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CritInfo } from '../crit-info';

declare const Desmos: any;

@Component({
	selector: 'app-calculator',
	templateUrl: './calculator.component.html',
	styleUrls: ['./calculator.component.scss']
})
export class CalculatorComponent implements AfterViewInit {
	@Input() critInfo!: CritInfo;
	@Input() compare?: CritInfo | false;
	@Input() closable?: boolean;
	@Output() onClosed = new EventEmitter();
	@ViewChild('desmos') desmosElement?: ElementRef<HTMLDivElement>;

	graph: any;

	updateGraph() {
		const isOptimal = this.critInfo.multiplier === this.critInfo.bestMultiplier;

		this.graph.removeExpressions(this.graph.getExpressions());

		this.graph.setExpression({
			color: '#2d70b3',
			latex: String.raw`y=\left(1+\max\left(0,\min\left(\frac{x}{100},1\right)\right)\max\left(${this.critInfo.value!}-\frac{x}{50},0\right)\right)\cdot100`
		})

		this.graph.setExpression({
			color: '#c74440',
			latex: String.raw`\left(${this.critInfo.rate * 100},${this.critInfo.multiplier * 100}\right)`,
			label: `Current${isOptimal ? ' (Optimal)' : ''}`,
			showLabel: true
		})

		if (!isOptimal)
			this.graph.setExpression({
				color: '#fa7e19',
				latex: String.raw`\left(${this.critInfo.bestRate * 100},${this.critInfo.bestMultiplier * 100}\right)`,
				label: 'Optimal',
				showLabel: true
			})

		this.graph.setMathBounds({
			left: Math.min(this.critInfo.value * 50 * -0.1, this.critInfo.rate * 100 * 1.1),
			right: Math.max(this.critInfo.value * 50 * 1.1, this.critInfo.rate * 100 * -0.1),
			top: this.critInfo.bestMultiplier * 110,
			bottom: this.critInfo.bestMultiplier * -10
		})
	}

	ngAfterViewInit() {
		this.graph = Desmos.GraphingCalculator(this.desmosElement!.nativeElement, {
			expressions: false,
			lockViewport: true,
			xAxisLabel: 'CRIT Rate (%)',
			yAxisLabel: 'CRIT Multiplier (%)',
			settingsMenu: false
		});

		this.critInfo.afterRecalculate.subscribe(this.updateGraph.bind(this));
		this.updateGraph();
	}
}
