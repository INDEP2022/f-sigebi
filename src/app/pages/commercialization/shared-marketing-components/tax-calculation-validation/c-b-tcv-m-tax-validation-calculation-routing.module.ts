import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CBTcvCTaxValidationCalculationComponent } from './tax-calculation-validation/c-b-tcv-c-tax-validation-calculation.component';

const routes: Routes = [
  {
    path: '',
    component: CBTcvCTaxValidationCalculationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBTcvMTaxValidationCalculationRoutingModule { }
