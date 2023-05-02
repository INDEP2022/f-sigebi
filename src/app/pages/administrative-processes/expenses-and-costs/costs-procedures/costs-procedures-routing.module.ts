import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostsProceduresComponent } from './costs-procedures/costs-procedures.component';

const routes: Routes = [
  {
    path: '',
    component: CostsProceduresComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CostsProceduresRoutingModule {}
