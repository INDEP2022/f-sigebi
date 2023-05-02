import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VariableCostComponent } from './variable-cost/variable-cost.component';

const routes: Routes = [
  {
    path: '',
    component: VariableCostComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VariableCostRoutingModule {}
