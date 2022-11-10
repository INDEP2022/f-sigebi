import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpIConsolidatedComponent } from './gp-i-consolidated/gp-i-consolidated.component';

const routes: Routes = [
  {
    path: '',
    component: GpIConsolidatedComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpIConsolidatedRoutingModule {}
