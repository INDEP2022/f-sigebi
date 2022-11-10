import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCCatFinancialIndicatorsComponent } from './c-p-c-cat-financial-indicators/c-p-c-cat-financial-indicators.component';
import { CPMCatFinancialIndicatorsRoutingModule } from './c-p-m-cat-financial-indicators-routing.module';

@NgModule({
  declarations: [CPCCatFinancialIndicatorsComponent],
  imports: [CommonModule, CPMCatFinancialIndicatorsRoutingModule, SharedModule],
})
export class CPMCatFinancialIndicatorsModule {}
