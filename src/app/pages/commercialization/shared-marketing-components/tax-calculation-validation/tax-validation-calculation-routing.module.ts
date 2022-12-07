import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { TaxValidationCalculationComponent } from './tax-calculation-validation/tax-validation-calculation.component';

const routes: Routes = [
  {
    path: '',
    component: TaxValidationCalculationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaxValidationCalculationRoutingModule {}
