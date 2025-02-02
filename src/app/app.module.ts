import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { InputComponent } from './input/input.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { EquationsComponent } from './equations/equations.component';
import { EfficiencyGraphComponent } from './efficiency-graph/efficiency-graph.component';
import { FooterComponent } from './footer/footer.component';
import { OutputComponent } from './output/output.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IORowComponent } from './io-row/io-row.component';
import { CalculationRowComponent } from './calculation-row/calculation-row.component';
import { PercentagePipe } from './percentage.pipe';
import { RatioPipe } from './ratio.pipe';
import { BaseGraphComponent } from './base-graph/base-graph.component';

@NgModule({
	declarations: [
		AppComponent,
		CalculatorComponent,
		InputComponent,
		SafeHtmlPipe,
		EquationsComponent,
		EfficiencyGraphComponent,
		FooterComponent,
		OutputComponent,
		IORowComponent,
		CalculationRowComponent,
		PercentagePipe,
		RatioPipe,
		BaseGraphComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatExpansionModule,
		MatCardModule,
		MatInputModule,
		MatTooltipModule
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
