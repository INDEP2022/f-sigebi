import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { ExpenseConceptsComponent } from './expense-concepts/expense-concepts.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseConceptsComponent,
  },
  {
    path: ':id',
    component: ExpenseConceptsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseConceptsRoutingModule {}
