import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { SummaryFinancialInfoComponent } from './summary-financial-info/summary-financial-info.component';

const routes: Routes = [
  {
    path: '',
    component: SummaryFinancialInfoComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialInfoRoutingModule {}
