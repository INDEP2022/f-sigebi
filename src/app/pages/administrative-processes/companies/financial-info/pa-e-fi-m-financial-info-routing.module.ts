import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { PaEFiCSummaryFinancialInfoComponent } from './summary-financial-info/pa-e-fi-c-summary-financial-info.component';

const routes: Routes = [
  {
    path: '',
    component: PaEFiCSummaryFinancialInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaEFiMFinancialInfoRoutingModule {}
