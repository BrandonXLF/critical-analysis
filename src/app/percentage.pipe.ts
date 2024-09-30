import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
	name: 'percentage'
})
export class PercentagePipe implements PipeTransform {
	transform(value: number): unknown {
		return formatNumber(value * 100, 'en', '1.0-2') + '%';
	}
}
