import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesTypeUnitPricesComponent } from './services-type-unit-prices/services-type-unit-prices.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesTypeUnitPricesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesTypeUnitRoutingModule {}
