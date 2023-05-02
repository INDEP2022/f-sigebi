import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesRegisterComponent } from './expenses-register/expenses-register.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensesRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpensesRegisterRoutingModule {}
