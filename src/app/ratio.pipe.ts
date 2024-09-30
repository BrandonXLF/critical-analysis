import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({
	name: 'ratio'
})
export class RatioPipe implements PipeTransform {
	transform(value: number): unknown {
		return '1:' + formatNumber(value, 'en', '1.0-2');
	}
}
