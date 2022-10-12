import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CBEclCExpenseConceptsListComponent } from './expense-concepts-list/c-b-ecl-c-expense-concepts-list.component';

const routes: Routes = [
  {
    path: '',
    component: CBEclCExpenseConceptsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBEcMPaymentsConceptsRoutingModule { }
