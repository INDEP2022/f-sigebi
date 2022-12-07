import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatFinancialInformationAttributesComponent } from './cat-financial-information-attributes/cat-financial-information-attributes.component';

const routes: Routes = [
  {
    path: '',
    component: CatFinancialInformationAttributesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatFinancialInformationAttributesRoutingModule {}
