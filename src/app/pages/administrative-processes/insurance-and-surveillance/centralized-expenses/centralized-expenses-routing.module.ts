import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CentralizedExpensesComponent } from './centralized-expenses/centralized-expenses.component';

const routes: Routes = [
  {
    path: '',
    component: CentralizedExpensesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CentralizedExpensesRoutingModule {}
