import { EventEmitter } from "@angular/core";

export class CritInfo {
    value!: number;
    multiplier!: number;
	ratio!: number;

    bestRate!: number;
    bestDmg!: number;
    bestMultiplier!: number;
	bestRatio!: number;

    efficiency!: number;
    afterRecalculate = new EventEmitter();

    constructor(private _rate: number, private _dmg: number) {
        this.recalculate();
    }

    get rate() {
        return this._rate;
    }

    set rate(val: number) {
        this._rate = val;
        this.recalculate();
    }

    get dmg() {
        return this._dmg;
    }

    set dmg(val: number) {
        this._dmg = val;
        this.recalculate();
    }

    recalculate() {
        this.value = 2 * this._rate + this._dmg;
        this.multiplier = 1 + Math.max(0, Math.min(1, this.rate) * this.dmg);
        this.ratio = this.dmg / this.rate;

		this.bestRate = this.value < 0 ? this.value / 2 : (this.value >= 4 ? 1 : this.value / 4);
		this.bestDmg = this.value < 0 ? 0 : (this.value >= 4 ? this.value - 2 : this.value / 2);
        this.bestMultiplier = 1 + this.bestRate * this.bestDmg;
        this.bestRatio = this.bestDmg / this.bestRate;

        this.efficiency = this.multiplier / this.bestMultiplier;

        this.afterRecalculate.emit();
    }
}
