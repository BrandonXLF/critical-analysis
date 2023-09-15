import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { OutputComponent } from './output/output.component';
import { InputComponent } from './input/input.component';
import { RatioComponent } from './ratio/ratio.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CalculationsComponent } from './calculations/calculations.component';
import { GraphComponent } from './graph/graph.component';

@NgModule({
	declarations: [
		AppComponent,
		CalculatorComponent,
		OutputComponent,
		InputComponent,
		RatioComponent,
		SafeHtmlPipe,
		CalculationsComponent,
  GraphComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		MatExpansionModule,
		MatCardModule,
		MatInputModule
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
