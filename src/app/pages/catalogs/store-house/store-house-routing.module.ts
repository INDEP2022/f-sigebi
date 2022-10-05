import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorehouseListComponent } from './storehouse-list/storehouse-list.component';

const routes: Routes = [
  {
    path: '',
    component: StorehouseListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StoreHouseRoutingModule {}
