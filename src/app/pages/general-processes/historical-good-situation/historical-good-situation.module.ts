import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FindInventaryComponent } from './find-inventary/find-inventary.component';
import { HistoricalGoodSituationRoutingModule } from './historical-good-situation-routing.module';
import { HistoricalGoodSituationComponent } from './historical-good-situation/historical-good-situation.component';

@NgModule({
  declarations: [HistoricalGoodSituationComponent, FindInventaryComponent],
  imports: [
    CommonModule,
    HistoricalGoodSituationRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    FormLoaderComponent,
  ],
})
export class HistoricalGoodSituationModule {}
