/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { HistoricalSituationGoodsRoutingModule } from './historical-situation-goods-routing.module';

/** COMPONENTS IMPORTS */
import { EventEmitterService } from '../issue-agreements/issue-agreements/eventEmitter.service';
import { HistoricalSituationGoodsComponent } from './historical-situation-goods/historical-situation-goods.component';

@NgModule({
  declarations: [HistoricalSituationGoodsComponent],
  imports: [CommonModule, HistoricalSituationGoodsRoutingModule, SharedModule],
  exports: [HistoricalSituationGoodsComponent],
  providers: [EventEmitterService],
})
export class HistoricalSituationGoodsModule {}
