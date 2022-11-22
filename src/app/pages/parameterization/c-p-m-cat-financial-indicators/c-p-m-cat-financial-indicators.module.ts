import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCCatFinancialIndicatorsModalComponent } from './c-p-c-cat-financial-indicators-modal/c-p-c-cat-financial-indicators-modal.component';
import { CPCCatFinancialIndicatorsComponent } from './c-p-c-cat-financial-indicators/c-p-c-cat-financial-indicators.component';
import { CPMCatFinancialIndicatorsRoutingModule } from './c-p-m-cat-financial-indicators-routing.module';

@NgModule({
  declarations: [
    CPCCatFinancialIndicatorsComponent,
    CPCCatFinancialIndicatorsModalComponent,
  ],
  imports: [
    CommonModule,
    CPMCatFinancialIndicatorsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatFinancialIndicatorsModule {}
