import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCcCostCatalogComponent } from './c-p-cc-cost-catalog/c-p-cc-cost-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPCcCostCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCostCatalogRoutingModule {}
