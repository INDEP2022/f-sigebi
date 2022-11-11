import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCBankConceptsComponent } from './c-p-c-bank-concepts/c-p-c-bank-concepts.component';

const routes: Routes = [
  {
    path: '',
    component: CPCBankConceptsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMBankConceptsRoutingModule {}
