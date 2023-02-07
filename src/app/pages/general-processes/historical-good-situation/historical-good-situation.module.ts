import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HistoricalGoodSituationRoutingModule } from './historical-good-situation-routing.module';
import { HistoricalGoodSituationComponent } from './historical-good-situation/historical-good-situation.component';

@NgModule({
  declarations: [HistoricalGoodSituationComponent],
  imports: [
    CommonModule,
    HistoricalGoodSituationRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
  ],
})
export class HistoricalGoodSituationModule {}
