import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpHistoricalGoodSituationRoutingModule } from './gp-historical-good-situation-routing.module';
import { GpHistoricalGoodSituationComponent } from './gp-historical-good-situation/gp-historical-good-situation.component';

@NgModule({
  declarations: [GpHistoricalGoodSituationComponent],
  imports: [
    CommonModule,
    GpHistoricalGoodSituationRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
  ],
})
export class GpHistoricalGoodSituationModule {}
