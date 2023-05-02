/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { HistoricalSituationGoodsModule } from '../historical-situation-goods/historical-situation-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { IssueAgreementsRoutingModule } from './issue-agreements-routing.module';

/** COMPONENTS IMPORTS */
import { EventEmitterService } from './issue-agreements/eventEmitter.service';
import {
  CheckboxComponent,
  IssueAgreementsComponent,
} from './issue-agreements/issue-agreements.component';

@NgModule({
  declarations: [IssueAgreementsComponent, CheckboxComponent],
  imports: [
    CommonModule,
    IssueAgreementsRoutingModule,
    SharedModule,
    HistoricalSituationGoodsModule,
  ],
  providers: [EventEmitterService],
})
export class IssueAgreementsModule {}
