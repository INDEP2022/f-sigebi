import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { SaleStatusComponent } from './sale-status/sale-status.component';

const routes: Routes = [
  {
    path: '',
    component: SaleStatusComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaleStatusRoutingModule {}
