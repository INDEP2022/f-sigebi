import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { DrGoodsBulkLoadRoutingModule } from './dr-goods-bulk-load-routing.module';
import { DrGoodsBulkLoadComponent } from './dr-goods-bulk-load/dr-goods-bulk-load.component';

@NgModule({
  declarations: [DrGoodsBulkLoadComponent],
  imports: [CommonModule, DrGoodsBulkLoadRoutingModule, SharedModule],
})
export class DrGoodsBulkLoadModule {}
