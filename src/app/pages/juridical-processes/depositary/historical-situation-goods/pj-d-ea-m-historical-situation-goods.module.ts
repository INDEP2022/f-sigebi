/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDAEHistoricalSituationGoodsRoutingModule } from './pj-d-ea-m-historical-situation-goods-routing.module';

/** COMPONENTS IMPORTS */
import { PJDAEHistoricalSituationGoodsComponent } from './historical-situation-goods/pj-d-ea-c-historical-situation-goods.component';

@NgModule({
  declarations: [PJDAEHistoricalSituationGoodsComponent],
  imports: [
    CommonModule,
    PJDAEHistoricalSituationGoodsRoutingModule,
    SharedModule,
  ],
})
export class PJDAEHistoricalSituationGoodsModule {}
