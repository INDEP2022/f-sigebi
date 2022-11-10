/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { PJDAEHistoricalSituationGoodsModule } from '../historical-situation-goods/pj-d-ea-m-historical-situation-goods.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDEAIssueAgreementsRoutingModule } from './pj-d-ea-m-issue-agreements-routing.module';

/** COMPONENTS IMPORTS */
import { EventEmitterService } from './issue-agreements/eventEmitter.service';
import { PJDEAIssueAgreementsComponent } from './issue-agreements/pj-d-ea-c-issue-agreements.component';

@NgModule({
  declarations: [PJDEAIssueAgreementsComponent],
  imports: [
    CommonModule,
    PJDEAIssueAgreementsRoutingModule,
    SharedModule,
    PJDAEHistoricalSituationGoodsModule,
  ],
  providers: [EventEmitterService],
})
export class PJDEAIssueAgreementsModule {}
