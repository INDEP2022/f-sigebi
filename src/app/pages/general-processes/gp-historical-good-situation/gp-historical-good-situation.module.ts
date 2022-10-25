import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GpHistoricalGoodSituationRoutingModule } from './gp-historical-good-situation-routing.module';
import { GpHistoricalGoodSituationComponent } from './gp-historical-good-situation/gp-historical-good-situation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

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
