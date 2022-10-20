/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDEAIssueAgreementsComponent } from './issue-agreements/pj-d-ea-c-issue-agreements.component';

const routes: Routes = [
  {
    path: '',
    component: PJDEAIssueAgreementsComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDEAIssueAgreementsRoutingModule {}
