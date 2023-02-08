import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ControlServiceOrdersComponent } from './control-service-orders/control-service-orders.component';

const routes: Routes = [
  {
    path: '',
    component: ControlServiceOrdersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ControlServiceOrdersRoutingModule {}
