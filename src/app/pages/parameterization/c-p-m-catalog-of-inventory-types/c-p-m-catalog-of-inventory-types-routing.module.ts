import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCitCCatalogOfInventoryTypesComponent } from './c-p-cit-c-catalog-of-inventory-types/c-p-cit-c-catalog-of-inventory-types.component';

const routes: Routes = [
  {
    path: '',
    component: CPCitCCatalogOfInventoryTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMCatalogOfInventoryTypesRoutingModule {}
