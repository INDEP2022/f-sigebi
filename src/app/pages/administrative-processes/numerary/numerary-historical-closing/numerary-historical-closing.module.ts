import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { NumeraryHistoricalClosingRoutingModule } from './numerary-historical-closing-routing.module';
import { NumeraryHistoricalClosingComponent } from './numerary-historical-closing/numerary-historical-closing.component';

@NgModule({
  declarations: [NumeraryHistoricalClosingComponent],
  imports: [CommonModule, NumeraryHistoricalClosingRoutingModule, SharedModule],
})
export class NumeraryHistoricalClosingModule {}
