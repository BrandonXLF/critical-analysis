import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CalculatorComponent } from './calculator/calculator.component';
import { OutputComponent } from './output/output.component';
import { InputComponent } from './input/input.component';
import { RatioComponent } from './ratio/ratio.component';
import { CellComponent } from './cell/cell.component';
import { SafeHtmlPipe } from './safe-html.pipe';

@NgModule({
  declarations: [
    AppComponent,
    CalculatorComponent,
    OutputComponent,
    InputComponent,
    RatioComponent,
    CellComponent,
    SafeHtmlPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
