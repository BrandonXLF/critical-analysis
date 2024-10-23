import { Component, Input } from '@angular/core';

export interface GraphPoint {
	x: number;
	y: number;
	label: string;
	color: string;
	labelRelX: number;
	labelRelY: number;
	anchor?: string;
	baseline?: string;
}

export interface GraphAxis {
	dir: 'hoz' | 'vert',
	color?: string;
	offset: number;
	label: string;
	labelOffset: number;
	textPos: {
		position: 'near' | 'far';
		textOffset: number;
		alignment: string;
	}[];
	displayFactor?: number;
	inverse?: boolean;
	getOverride?: (value: number) => {from?: number, to?: number};
}

export type GraphLineCommand = {
	type: 'move' | 'line-to';
	x: number;
	y: number;
} | {
	type: 'bezier';
	ctrlX: number;
	ctrlY: number;
	x: number;
	y: number;
}

export type GridPoint = [number, number];

@Component({
	selector: 'app-base-graph',
	templateUrl: './base-graph.component.html',
	styleUrl: './base-graph.component.scss'
})
export class BaseGraphComponent {
	/**
	 * Bottom-left corner of the graph.
	 */
	@Input() startPoint: GridPoint = [0, 0];
	/**
	 * Width and height of the graph.
	 */
	@Input() size: GridPoint = [0, 0];
	@Input() points: GraphPoint[] = [];
	@Input() axes: GraphAxis[] = [];
	@Input() lineCmds: GraphLineCommand[] = [];

	static readonly EPSILON = 0.00001;

	static readonly STEPS = [
		[20, 5], [40, 10], [80, 20], [160, 40],
		[400, 100], [1000, 200], [Infinity, 500]
	];

	static readonly LINE_COLOR = '#5E9AFF';
	static readonly LINE_SIZE = 3;
	static readonly DEFAULT_AXIS_COLOR = '#FFFFFF';

	static SVG_COMMANDS: Record<GraphLineCommand['type'], 'L' | 'M' | 'Q'> = {
		'move': 'M',
		'line-to': 'L',
		'bezier': 'Q'
	};

	scaleX = 0;
	scaleY = -1;
	viewBox = '0 0 0 0';
	fontSize = 12;

	svgPaths: {
		size: number;
		color: string;
		cmd: string;
		crisp?: boolean;
	}[] = [];

	svgTexts: {
		x: number;
		y: number;
		str: string;
		baseline?: string;
		anchor?: string;
		sideways?: boolean;
		fontScale?: number;
		color?: string;
	}[] = [];

	svgPoints: {
		x: number;
		y: number;
		color?: string;
	}[] = [];

	private calculateTextPos(
		hoz: boolean,
		val: 'center' | number,
		textDimension: GraphAxis['textPos'][0]
	) {
		if (val === 'center') {
			const posIndex = hoz ? 0 : 1;
			val = this.startPoint[posIndex] + this.size[posIndex] / 2;
		}

		const otherPos = hoz ? 1 : 0;
		const otherAxis = textDimension.position === 'near'
			? this.startPoint[otherPos]
			: this.startPoint[otherPos] + this.size[otherPos];

		return {
			x: hoz
				? val * this.scaleX
				: otherAxis * this.scaleX + textDimension.textOffset * this.fontSize,
			y: hoz
				? otherAxis * this.scaleY + textDimension.textOffset * this.fontSize
				: val * this.scaleY,
		};
	}

	drawAxis({
		dir, color, offset, label, labelOffset, textPos, getOverride, displayFactor, inverse
	}: GraphAxis) {
		displayFactor ??= 1;
		color ??= BaseGraphComponent.DEFAULT_AXIS_COLOR;

		const hoz = dir === 'hoz';
		const posIndex = hoz ? 0 : 1;

		let start = this.startPoint[posIndex];
		let end = start + this.size[posIndex];

		if (inverse) {
			[end, start] = [start, end];
		}

		const shouldContinue: (a: number, b: number) => boolean = inverse
			? (a, b) => a >= b
			: (a, b) => a <= b;

		const range = Math.abs(start - end);
		const step = BaseGraphComponent.STEPS.find(([maxRange]) => range < maxRange)![1];
		const increment = (step / 5) * (inverse ? -1 : 1);

		start += ((inverse ? offset : 0) - start) % increment;

		this.svgTexts.push({
			...this.calculateTextPos(hoz, 'center', {
				...textPos[0],
				textOffset: textPos[0].textOffset + labelOffset
			}),
			str: label,
			baseline: 'baseline',
			anchor: 'middle',
			sideways: !hoz,
			fontScale: 1.15
		});

		for (let value = start; shouldContinue(value, end); value += increment) {
			const adjustedValue = inverse
				? Math.round((offset - value) * 1000) / 1000
				: value;

			const secondaryOrAxis = adjustedValue % step === 0;

			if (secondaryOrAxis)
				textPos.forEach(textDimension => this.svgTexts.push({
					...this.calculateTextPos(hoz, value, textDimension),
					str: (adjustedValue * displayFactor).toString(),
					anchor: hoz ? 'middle' : textDimension.alignment,
					baseline: hoz ? textDimension.alignment : 'middle',
					color
				}));

			const override = getOverride?.(value) ?? {};

			const cmd = hoz
				? `M ${value * this.scaleX} ${(override.from ?? this.startPoint[1]) * this.scaleY} L ${value * this.scaleX} ${(override.to ?? (this.startPoint[1] + this.size[1])) * this.scaleY}`
				: `M ${(override.from ?? this.startPoint[0]) * this.scaleX} ${value * this.scaleY} L ${(override.to ?? (this.startPoint[0] + this.size[0])) * this.scaleX} ${value * this.scaleY}`

			if (adjustedValue === 0) {
				this.svgPaths.push({size: 2, color, crisp: true, cmd});
				continue;
			}

			if (secondaryOrAxis) {
				this.svgPaths.push({size: 1, color, crisp: true, cmd});
				continue;
			}

			this.svgPaths.push({size: 1, color: color + '55', crisp: true, cmd});
		}
	}

	drawPoint({
		x, y, label, color, labelRelX, labelRelY, anchor, baseline
	}: GraphPoint) {
		this.svgPoints.push({x: x * this.scaleX, y: y * this.scaleY, color});

		this.svgTexts.push({
			str: label,
			fontScale: 1.25,
			x: x * this.scaleX + labelRelX * this.fontSize,
			y: y * this.scaleY + labelRelY * this.fontSize,
			color,
			anchor,
			baseline
		});
	}

	drawLine() {
		const cmd = this.lineCmds.map(cmd => {
			const svgCmd = BaseGraphComponent.SVG_COMMANDS[cmd.type];

			if (cmd.type === 'bezier') {
				return `${svgCmd} ${cmd.ctrlX * this.scaleX} ${cmd.ctrlY * this.scaleY} ${cmd.x * this.scaleX} ${cmd.y * this.scaleY}`;
			}

			return `${svgCmd} ${cmd.x * this.scaleX} ${cmd.y * this.scaleY}`;
		}).join(' ');

		this.svgPaths.push({
			size: BaseGraphComponent.LINE_SIZE,
			color: BaseGraphComponent.LINE_COLOR,
			cmd
		});
	}

	ngOnChanges() {
		this.scaleX = this.size[1] / this.size[0];
		this.fontSize = this.size[1] / 22;

		this.viewBox = [
			this.startPoint[0] * this.scaleX - this.fontSize * 3.65,
			(this.startPoint[1] + this.size[1]) * this.scaleY - this.fontSize * 2.8,
			this.size[0] * this.scaleX + this.fontSize * 7.3,
			-this.size[1] * this.scaleY + this.fontSize * 5.6
		].join(' ');

		this.svgPaths = [];
		this.svgPoints = [];
		this.svgTexts = [];

		this.axes.forEach(axis => this.drawAxis(axis));
		this.points.forEach(point => this.drawPoint(point));
		this.drawLine();
	}
}
