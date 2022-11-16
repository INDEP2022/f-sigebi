import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPTccCTypesOfClaimsCatalogComponent } from './c-p-tcc-c-types-of-claims-catalog/c-p-tcc-c-types-of-claims-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPTccCTypesOfClaimsCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMTypesOfClaimsCatalogRoutingModule {}
