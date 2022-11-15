import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCCatFinancialInformationAttributesComponent } from './c-p-c-cat-financial-information-attributes/c-p-c-cat-financial-information-attributes.component';

const routes: Routes = [
  {
    path: '',
    component: CPCCatFinancialInformationAttributesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatFinancialInformationAttributesRoutingModule {}
