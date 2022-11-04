import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServiceOrdersFormatComponent } from './service-orders-format/service-orders-format.component';

const routes: Routes = [
  {
    path: '',
    component: ServiceOrdersFormatComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceOrdersFormatRoutingModule {}
