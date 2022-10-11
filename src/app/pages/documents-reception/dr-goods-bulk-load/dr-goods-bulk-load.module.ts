import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrGoodsBulkLoadRoutingModule } from './dr-goods-bulk-load-routing.module';
import { DrGoodsBulkLoadComponent } from './dr-goods-bulk-load/dr-goods-bulk-load.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DrGoodsBulkLoadComponent],
  imports: [CommonModule, DrGoodsBulkLoadRoutingModule, SharedModule],
})
export class DrGoodsBulkLoadModule {}
