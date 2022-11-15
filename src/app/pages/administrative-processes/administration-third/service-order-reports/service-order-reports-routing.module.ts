import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceOrderReportsComponent } from './service-order-reports/service-order-reports.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceOrderReportsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceOrderReportsRoutingModule {}
