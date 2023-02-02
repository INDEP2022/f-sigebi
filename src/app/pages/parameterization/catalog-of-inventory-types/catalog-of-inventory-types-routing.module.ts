import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogOfInventoryTypesComponent } from './catalog-of-inventory-types/catalog-of-inventory-types.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogOfInventoryTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogOfInventoryTypesRoutingModule {}
