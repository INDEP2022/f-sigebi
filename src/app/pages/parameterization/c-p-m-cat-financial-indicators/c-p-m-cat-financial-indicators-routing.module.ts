import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCCatFinancialIndicatorsComponent } from './c-p-c-cat-financial-indicators/c-p-c-cat-financial-indicators.component';

const routes: Routes = [
  {
    path: '',
    component: CPCCatFinancialIndicatorsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatFinancialIndicatorsRoutingModule {}
