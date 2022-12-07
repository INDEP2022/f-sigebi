import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { TransferRoutingModule } from './transfer-routing.module';
import { TransferComponent } from './transfer/transfer.component';

@NgModule({
  declarations: [TransferComponent],
  imports: [CommonModule, TransferRoutingModule, SharedModule],
})
export class TransferModule {}
