import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ServicesUnitPricesComponent } from './services-unit-prices/services-unit-prices.component';

const routes: Routes = [
  {
    path: '',
    component: ServicesUnitPricesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServicesUnitPricesRoutingModule {}
