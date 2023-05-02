import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDMUnderwritingCreditMemoRoutingModule } from './jp-d-m-underwriting-credit-memo-routing.module';
import { JpDUcmCUnderwritingCreditMemoComponent } from './jp-d-ucm-c-underwriting-credit-memo/jp-d-ucm-c-underwriting-credit-memo.component';

@NgModule({
  declarations: [JpDUcmCUnderwritingCreditMemoComponent],
  imports: [
    CommonModule,
    JpDMUnderwritingCreditMemoRoutingModule,
    SharedModule,
  ],
})
export class JpDMUnderwritingCreditMemoModule {}
