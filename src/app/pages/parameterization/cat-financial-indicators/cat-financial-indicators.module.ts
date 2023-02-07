import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CatFinancialIndicatorsModalComponent } from './cat-financial-indicators-modal/cat-financial-indicators-modal.component';
import { CatFinancialIndicatorsRoutingModule } from './cat-financial-indicators-routing.module';
import { CatFinancialIndicatorsComponent } from './cat-financial-indicators/cat-financial-indicators.component';

@NgModule({
  declarations: [
    CatFinancialIndicatorsComponent,
    CatFinancialIndicatorsModalComponent,
  ],
  imports: [
    CommonModule,
    CatFinancialIndicatorsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatFinancialIndicatorsModule {}
