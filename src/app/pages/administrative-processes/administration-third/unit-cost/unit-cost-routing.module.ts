import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnitCostComponent } from './unit-cost/unit-cost.component';

const routes: Routes = [
  {
    path: '',
    component: UnitCostComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UnitCostRoutingModule {}
