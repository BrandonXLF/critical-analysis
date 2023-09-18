import { Component, Input, AfterContentInit } from '@angular/core';
import { CritInfo } from '../crit-info';

@Component({
	selector: 'app-graph',
	templateUrl: './graph.component.html',
	styleUrls: ['./graph.component.scss']
  })
  export class GraphComponent implements AfterContentInit {
	static EPSILON = 0.00001;

	static STEPS = [
		[20, 5], [40, 10], [80, 20], [160, 40],
		[400, 100], [1000, 200], [Infinity, 500]
	];

	static HORIZONTAL = 0;
	static VERTICAL = 1;

	static GRAPH_COLOR = '#5E9AFF';
	static CRIT_DMG_COLOR = '#96AD00';
	static CRIT_RATE_COLOR = '#F2BEFC';
	static CRIT_MULT_COLOR = '#FFFFFF';
	static CURRENT_COLOR = '#F63C61';
	static OPTIMAL_COLOR = '#FFA552';

	@Input() critInfo!: CritInfo;

	startPoint: [number, number] = [0, 0];
	dimens: [number, number] = [0, 0];
	scaleX = 0;
	viewBox = '0 0 0 0';
	fontSize = 12;

	paths: {
		size: number;
		color: string;
		cmd: string;
		crisp?: boolean;
	}[] = [];

	texts: {
		x: number;
		y: number;
		str: string;
		baseline?: string;
		anchor?: string;
		sideways?: boolean;
		fontScale?: number;
		color?: string;
	}[] = [];

	points: {
		x: number;
		y: number;
		color?: string;
	}[] = [];

	drawAxis(
		dir: number,
		inverse: boolean,
		start: number,
		end: number,
		color: string,
		label: string,
		labelOffset: number,
		otherDimens: [number, string][],
		startHeight = 0,
		displayFactor = 1
	) {
		const shouldContinue: (a: number, b: number) => boolean = inverse
			? (a, b) => a >= b
			: (a, b) => a <= b;

		const range = Math.abs(start - end);
		const step = GraphComponent.STEPS.find(([maxRange]) => range < maxRange)![1];
		const increment = (step / 5) * (inverse ? -1 : 1);
		const hoz = dir === GraphComponent.HORIZONTAL;

		start += ((inverse ? this.critInfo.value * 100 : 0) - start) % increment;

		this.texts.push({
			str: label,
			x: hoz ? ((this.startPoint[0] + this.dimens[0] / 2) * this.scaleX) : otherDimens[0][0] + labelOffset,
			y: hoz ? otherDimens[0][0] + labelOffset : this.startPoint[1] + this.dimens[1] / 2,
			baseline: 'baseline',
			anchor: 'middle',
			sideways: !hoz,
			fontScale: 1.15
		})

		for (let value = start; shouldContinue(value, end); value += increment) {
			const adjustedValue = inverse
				? Math.round((this.critInfo.value * 100 - value) * 1000) / 1000
				: value;

			const secondaryOrAxis = adjustedValue % step === 0;

			if (secondaryOrAxis)
				otherDimens.forEach(([otherDimen, otherPos]) => this.texts.push({
					str: (adjustedValue / displayFactor).toString(),
					x: hoz ? (value * this.scaleX) : otherDimen,
					y: hoz ? otherDimen : -value,
					anchor: hoz ? 'middle' : otherPos,
					baseline: hoz ? otherPos : 'middle'
				}));

			const cmd = hoz
				? `M ${value * this.scaleX} ${this.startPoint[1] + startHeight} V -${Math.max(0, this.critInfo.value - (value / 100)) * Math.max(0, Math.min(value / 200, 1)) * 100 + 100}`
				: `M ${this.startPoint[0] * this.scaleX} ${-value} h ${this.dimens[0] * this.scaleX}`;

			if (adjustedValue === 0) {
				this.paths.push({size: 2, color, crisp: true, cmd});
				continue;
			}

			if (secondaryOrAxis) {
				this.paths.push({size: 1, color, crisp: true, cmd});
				continue;
			}

			this.paths.push({size: 1, color: color + '55', crisp: true, cmd});
		}
	}

	drawPoint(
		x: number,
		y: number,
		label: string,
		color: string,
		labelRelX: number,
		labelRelY: number,
		anchor?: string,
		baseline?: string
	) {
		this.points.push({x, y, color});

		this.texts.push({
			str: label,
			fontScale: 1.25,
			x: x + labelRelX,
			y: y + labelRelY,
			color,
			anchor,
			baseline
		});
	}

	drawLines() {
		let cmd = '';

		// Start line
		cmd += `M ${this.startPoint[0] * this.scaleX} -100 H 0`;

		// Parabola
		if (this.critInfo.value > 0) {
			const curveEndX = this.critInfo.value > 2 ? 200 : this.critInfo.value * 100;
			const curveEndY = -(this.critInfo.value > 2 ? (this.critInfo.value - 2) * 100 : 0) - 100;

			// https://math.stackexchange.com/a/1258196
			const controlPointX = curveEndX / 2;
			const controlPointY = (curveEndX / 4) * -this.critInfo.value - 100;

			cmd += `Q ${controlPointX * this.scaleX} ${controlPointY} ${curveEndX * this.scaleX} ${curveEndY}`;
		}

		// CRIT rate > 100
		if (this.critInfo.value > 2)
			cmd += `L ${this.critInfo.value * 100 * this.scaleX} -100`;

		// End line
		cmd += `H ${(this.startPoint[0] + this.dimens[0]) * this.scaleX}`;

		this.paths.push({size: 3, color: GraphComponent.GRAPH_COLOR, cmd});
	}

	update() {
		const isOptimal = Math.abs(this.critInfo.multiplier - this.critInfo.bestMultiplier) < GraphComponent.EPSILON;

		this.startPoint = [
			Math.min(this.critInfo.value * 100 * -0.1, this.critInfo.rate * 200 * 1.1) || -0.1,
			-this.critInfo.bestMultiplier * 100 * 1.2
		]

		this.dimens = [
			Math.max(1.1, Math.max(this.critInfo.value * 100 * 1.1, this.critInfo.rate * -20) - this.startPoint[0]),
			this.critInfo.bestMultiplier * 100 * 1.3
		];

		this.scaleX = this.dimens[1] / this.dimens[0];
		this.fontSize = this.dimens[1] / 22;
		this.viewBox = `${this.startPoint[0] * this.scaleX - this.fontSize * 3.65} ${this.startPoint[1] - this.fontSize * 2.8} ${this.dimens[0] * this.scaleX + this.fontSize * 7.3} ${this.dimens[1] + this.fontSize * 5.6}`;

		this.paths = [];
		this.points = [];
		this.texts = [];

		const lowestValue = Math.min(Math.min(0, this.critInfo.rate * 220), this.critInfo.value * -10);
		const highestValue = Math.max(this.critInfo.rate * -20, this.critInfo.value * 110);

		this.drawAxis(
			GraphComponent.HORIZONTAL,
			false,
			lowestValue,
			highestValue,
			GraphComponent.CRIT_RATE_COLOR,
			'CRIT Rate (%)',
			this.fontSize * 1.5,
			[
				[this.startPoint[1] + this.dimens[1] + this.fontSize, 'text-top']
			],
			this.dimens[1],
			2
		);

		this.drawAxis(
			GraphComponent.HORIZONTAL,
			true,
			highestValue,
			lowestValue,
			GraphComponent.CRIT_DMG_COLOR,
			'CRIT DMG (%)',
			-this.fontSize * 0.7,
			[
				[this.startPoint[1] - this.fontSize * 1.05, 'hanging']
			]
		);

		this.drawAxis(
			GraphComponent.VERTICAL,
			false,
			this.critInfo.bestMultiplier * -10,
			this.critInfo.bestMultiplier * 120,
			GraphComponent.CRIT_MULT_COLOR,
			'CRIT Multiplier (%)',
			-this.fontSize * 2.55,
			[
				[this.startPoint[0] * this.scaleX - this.fontSize * 0.5, 'end'],
				[(this.startPoint[0] + this.dimens[0]) * this.scaleX + this.fontSize * 0.5, 'start']
			]
		);

		this.drawLines();

		this.drawPoint(
			this.critInfo.rate * 200 * this.scaleX,
			-this.critInfo.multiplier * 100,
			isOptimal ? 'Current (Optimal)' : 'Current',
			GraphComponent.CURRENT_COLOR,
			this.fontSize / 2 * (this.critInfo.rate <= this.critInfo.bestRate ? 1 : -1),
			this.fontSize / 2,
			(this.critInfo.rate <= this.critInfo.bestRate) ? 'start' : 'end',
			'hanging'
		);

		if (!isOptimal)
			this.drawPoint(
				this.critInfo.bestRate * 200 * this.scaleX,
				-this.critInfo.bestMultiplier * 100,
				'Optimal',
				GraphComponent.OPTIMAL_COLOR,
				this.fontSize / 2,
				-this.fontSize / 2
			);
	}

	ngAfterContentInit() {
		this.critInfo.afterRecalculate.subscribe(this.update.bind(this));
		this.update();
	}
}
