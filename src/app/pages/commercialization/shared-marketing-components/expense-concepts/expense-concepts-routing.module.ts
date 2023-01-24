import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { ExpenseConceptsListComponent } from './expense-concepts-list/expense-concepts-list.component';

const routes: Routes = [
  {
    path: '',
    component: ExpenseConceptsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExpenseConceptsRoutingModule {}
