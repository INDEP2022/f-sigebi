import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialInformationComponent } from './financial-information/financial-information.component';

const routes: Routes = [
  {
    path: '',
    component: FinancialInformationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialInformationRoutingModule {}
