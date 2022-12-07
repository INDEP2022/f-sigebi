import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalChangeNumeraireComponent } from './approval-change-numeraire/approval-change-numeraire.component';

const routes: Routes = [
  {
    path: '',
    component: ApprovalChangeNumeraireComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApprovalChangeNumeraireRoutingModule {}
