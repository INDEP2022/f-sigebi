import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListTypeOfInventoryComponent } from './list-type-of-inventory/list-type-of-inventory.component';

const routes: Routes = [
  {
    path: '',
    component: ListTypeOfInventoryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogOfInventoryTypesRoutingModule {}
