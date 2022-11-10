import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehousesComponent } from './warehouses/warehouses.component';

const routes: Routes = [
  {
    path: '',
    component: WarehousesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehousesRoutingModule {}
