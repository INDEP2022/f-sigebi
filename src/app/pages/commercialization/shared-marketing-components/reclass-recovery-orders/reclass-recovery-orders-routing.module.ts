import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclassRecoveryOrdersComponent } from './reclass-recovery-orders/reclass-recovery-orders.component';

const routes: Routes = [
  {
    path: '',
    component: ReclassRecoveryOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReclassRecoveryOrdersRoutingModule {}
