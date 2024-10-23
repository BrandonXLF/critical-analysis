import { Component, Input, AfterContentInit } from '@angular/core';
import { CritInfo } from '../crit-info';
import { GraphPoint, GraphAxis, GraphLineCommand, BaseGraphComponent, GridPoint } from '../base-graph/base-graph.component';

@Component({
	selector: 'app-efficiency-graph',
	templateUrl: './efficiency-graph.component.html'
})
export class EfficiencyGraphComponent implements AfterContentInit {
	@Input() critInfo!: CritInfo;

	startPoint: GridPoint = [0, 0];
	size: GridPoint = [0, 0];
	points: GraphPoint[] = [];
	axes: GraphAxis[] = [];
	lineCmds: GraphLineCommand[] = [];

	static readonly CRIT_DMG_COLOR = '#B1CC00';
	static readonly CRIT_RATE_COLOR = '#F2BEFC';
	static readonly CURRENT_COLOR = '#F63C61';
	static readonly OPTIMAL_COLOR = '#FFA552';

	setBounds() {
		const lowestValue = Math.min(this.critInfo.rate * 220, 0, this.critInfo.value * -10);
		const highestValue = Math.max(this.critInfo.rate * -20, this.critInfo.value * 110);

		this.startPoint = [
			lowestValue,
			this.critInfo.bestMultiplier * -10
		]

		this.size = [
			highestValue - lowestValue,
			this.critInfo.bestMultiplier * 130
		];
	}

	/**
	 * Get the CRIT multiplier for the graph at the given CRIT rate value.
	 */
	getMultiplier(rateValue: number) {
		// Either CRIT rate or DMG are 0 or less
		if (rateValue <= 0 || this.critInfo.value * 100 <= rateValue) return 100;

		// CRIT rate >= 100
		if (rateValue >= 200) return this.critInfo.value * 100 - rateValue + 100;

		// [CRIT dmg] * [CRIT rate] + 1
		return (this.critInfo.value * 100 - rateValue) * (rateValue / 200) + 100;
	}

	drawAxes() {
		this.axes = [
			{
				dir: 'hoz',
				color: EfficiencyGraphComponent.CRIT_RATE_COLOR,
				offset: this.critInfo.value * 100,
				label: 'CRIT Rate (%)',
				labelOffset: 1.5,
				textPos: [
					{position: 'near', textOffset: 1, alignment: 'text-top'}
				],
				getOverride: value => ({
					to: this.getMultiplier(value)
				}),
				displayFactor: 0.5
			},
			{
				dir: 'hoz',
				color: EfficiencyGraphComponent.CRIT_DMG_COLOR,
				offset: this.critInfo.value * 100,
				label: 'CRIT DMG (%)',
				labelOffset: -0.7,
				textPos: [
					{position: 'far', textOffset: -1, alignment: 'hanging'}
				],
				getOverride: value => ({
					from: this.startPoint[1] + this.size[1],
					to: this.getMultiplier(value)
				}),
				inverse: true
			},
			{
				dir: 'vert',
				offset: this.critInfo.value * 100,
				label: 'CRIT Multiplier (%)',
				labelOffset: -2.55,
				textPos: [
					{position: 'near', textOffset: -0.5, alignment: 'end'},
					{position: 'far', textOffset: 0.5, alignment: 'start'}
				]
			}
		];
	}

	drawLines() {
		// Start line
		this.lineCmds = [
			{
				type: 'move',
				x: this.startPoint[0],
				y: 100
			},
			{
				type: 'line-to',
				x: 0,
				y: 100
			}
		];

		// Parabola
		if (this.critInfo.value > 0) {
			const curveEndX = this.critInfo.value > 2 ? 200 : this.critInfo.value * 100;

			// https://math.stackexchange.com/a/1258196
			this.lineCmds.push({
				type: 'bezier',
				ctrlX: curveEndX / 2,
				ctrlY: (curveEndX / 4) * this.critInfo.value + 100,
				x: curveEndX,
				y: this.getMultiplier(curveEndX)
			});
		}

		// CRIT rate > 100
		if (this.critInfo.value > 2)
			this.lineCmds.push({
				type: 'line-to',
				x: this.critInfo.value * 100,
				y: 100
			});

		// End line
		this.lineCmds.push({
			type: 'line-to',
			x: this.startPoint[0] + this.size[0],
			y: 100
		});
	}

	drawPoints() {
		const isOptimal = Math.abs(this.critInfo.multiplier - this.critInfo.bestMultiplier) < BaseGraphComponent.EPSILON;

		this.points = [
			{
				x: this.critInfo.rate * 200,
				y: this.critInfo.multiplier * 100,
				label: isOptimal ? 'Current (Optimal)' : 'Current',
				color: EfficiencyGraphComponent.CURRENT_COLOR,
				labelRelX: 0.5 * (this.critInfo.rate <= this.critInfo.bestRate ? 1 : -1),
				labelRelY: 0.5,
				anchor: (this.critInfo.rate <= this.critInfo.bestRate) ? 'start' : 'end',
				baseline: 'hanging'
			}
		];

		if (!isOptimal)
			this.points.push({
				x: this.critInfo.bestRate * 200,
				y: this.critInfo.bestMultiplier * 100,
				label: 'Optimal',
				color: EfficiencyGraphComponent.OPTIMAL_COLOR,
				labelRelX: 0.5,
				labelRelY: -0.5
			});
	}

	update() {
		this.setBounds();
		this.drawAxes();
		this.drawLines();
		this.drawPoints();
	}

	ngAfterContentInit() {
		this.critInfo.afterRecalculate.subscribe(this.update.bind(this));
		this.update();
	}
}
