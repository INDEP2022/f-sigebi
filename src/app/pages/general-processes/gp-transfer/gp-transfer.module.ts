import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpTransferRoutingModule } from './gp-transfer-routing.module';
import { GpTransferComponent } from './gp-transfer/gp-transfer.component';

@NgModule({
  declarations: [GpTransferComponent],
  imports: [CommonModule, GpTransferRoutingModule, SharedModule],
})
export class GpTransferModule {}
