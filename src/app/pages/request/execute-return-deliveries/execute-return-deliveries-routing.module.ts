import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApproveRestitutionFormComponent } from './approve-restitution-form/approve-restitution-form.component';
import { ClassificationGoodsFormComponent } from './classification-goods-form/classification-goods-form.component';
import { ExecuteReturnDeliveriesListComponent } from './execute-return-deliveries-list/execute-return-deliveries-list.component';
import { RestitutionGoodsFormComponent } from './restitution-goods-form/restitution-goods-form.component';

const routes: Routes = [
  {
    path: '',
    component: ExecuteReturnDeliveriesListComponent,
  },
  {
    path: 'approve-restitution/:id',
    component: ApproveRestitutionFormComponent,
  },
  {
    path: 'classification-goods/:id',
    component: ClassificationGoodsFormComponent,
  },
  {
    path: 'restitution-goods/:id',
    component: RestitutionGoodsFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecuteReturnDeliveriesRoutingModule {}
