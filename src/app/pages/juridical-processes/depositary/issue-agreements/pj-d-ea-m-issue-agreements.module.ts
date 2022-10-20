/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDEAIssueAgreementsRoutingModule } from './pj-d-ea-m-issue-agreements-routing.module';

/** COMPONENTS IMPORTS */
import { PJDEAIssueAgreementsComponent } from './issue-agreements/pj-d-ea-c-issue-agreements.component';

@NgModule({
  declarations: [PJDEAIssueAgreementsComponent],
  imports: [CommonModule, PJDEAIssueAgreementsRoutingModule, SharedModule],
})
export class PJDEAIssueAgreementsModule {}
