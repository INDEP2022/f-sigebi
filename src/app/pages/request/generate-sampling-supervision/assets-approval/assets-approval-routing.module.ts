import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveRestitutionComponent } from './approve-restitution/approve-restitution.component';

const routes: Routes = [
  {
    path: '',
    component: ApproveRestitutionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssetsApprovalRoutingModule {}
