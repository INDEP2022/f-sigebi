import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeGdaddCApprovalChangeNumeraireComponent } from './pe-gdadd-c-approval-change-numeraire/pe-gdadd-c-approval-change-numeraire.component';

const routes: Routes = [
  {
    path: '',
    component: PeGdaddCApprovalChangeNumeraireComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeGdaddMApprovalChangeNumeraireRoutingModule { }
