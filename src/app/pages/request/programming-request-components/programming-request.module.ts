import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProgrammingRequestRoutingModule } from './programming-request-routing.module';
import { DetailGoodProgrammingFormComponent } from './shared-components-programming/detail-good-programming-form/detail-good-programming-form.component';
import { GenerateReceiptGuardFormComponent } from './shared-components-programming/generate-receipt-guard-form/generate-receipt-guard-form.component';
import { GoodsReceiptsFormComponent } from './shared-components-programming/goods-receipts-form/goods-receipts-form.component';
import { RejectProgrammingFormComponent } from './shared-components-programming/reject-programming-form/reject-programming-form.component';

@NgModule({
  declarations: [
    DetailGoodProgrammingFormComponent,
    RejectProgrammingFormComponent,
    GoodsReceiptsFormComponent,
    GenerateReceiptGuardFormComponent,
  ],
  imports: [CommonModule, ProgrammingRequestRoutingModule, SharedModule],
})
export class ProgrammingRequestModule {}
