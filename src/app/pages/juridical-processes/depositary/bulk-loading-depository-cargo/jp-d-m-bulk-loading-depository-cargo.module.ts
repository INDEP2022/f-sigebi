import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDBldcCBulkLoadingDepositoryCargoComponent } from './jp-d-bldc-c-bulk-loading-depository-cargo/jp-d-bldc-c-bulk-loading-depository-cargo.component';
import { JpDMBulkLoadingDepositoryCargoRoutingModule } from './jp-d-m-bulk-loading-depository-cargo-routing.module';

@NgModule({
  declarations: [JpDBldcCBulkLoadingDepositoryCargoComponent],
  imports: [
    CommonModule,
    JpDMBulkLoadingDepositoryCargoRoutingModule,
    SharedModule,
  ],
})
export class JpDMBulkLoadingDepositoryCargoModule {}
