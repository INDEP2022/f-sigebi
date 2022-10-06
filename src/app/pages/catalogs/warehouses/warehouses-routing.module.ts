import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehousesListComponent } from './warehouses-list/warehouses-list.component';

const routes: Routes = [
  {
    path: '',
    component: WarehousesListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehousesRoutingModule {}
