import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CCBmtCBankMovementsTypesComponent } from './bank-movements-types/c-c-bmt-c-bank-movements-types.component';

const routes: Routes = [
  {
    path: '',
    component: CCBmtCBankMovementsTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCBmtMBankMovementsTypesRoutingModule {}
