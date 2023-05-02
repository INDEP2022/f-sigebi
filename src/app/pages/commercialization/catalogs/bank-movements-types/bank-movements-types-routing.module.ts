import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { BankMovementsTypesComponent } from './bank-movements-types/bank-movements-types.component';

const routes: Routes = [
  {
    path: '',
    component: BankMovementsTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BankMovementsTypesRoutingModule {}
