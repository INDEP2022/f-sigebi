import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BankConceptsComponent } from './bank-concepts/bank-concepts.component';

const routes: Routes = [
  {
    path: '',
    component: BankConceptsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankConceptsRoutingModule {}
