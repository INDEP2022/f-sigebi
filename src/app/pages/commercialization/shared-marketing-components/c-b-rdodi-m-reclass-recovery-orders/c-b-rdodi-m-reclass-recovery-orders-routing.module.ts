import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBRdodiCReclassRecoveryOrdersComponent } from './c-b-rdodi-c-reclass-recovery-orders/c-b-rdodi-c-reclass-recovery-orders.component';

const routes: Routes = [
  {
    path: '',
    component: CBRdodiCReclassRecoveryOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBRdodiMReclassRecoveryOrdersRoutingModule {}
