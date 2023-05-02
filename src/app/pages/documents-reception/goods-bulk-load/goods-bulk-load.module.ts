import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsBulkLoadRoutingModule } from './goods-bulk-load-routing.module';
import { GoodsBulkLoadComponent } from './goods-bulk-load/goods-bulk-load.component';

@NgModule({
  declarations: [GoodsBulkLoadComponent],
  imports: [CommonModule, GoodsBulkLoadRoutingModule, SharedModule],
})
export class GoodsBulkLoadModule {}
