import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WarehouseTypeComponent } from './warehouse-type/warehouse-type.component';

const routes: Routes = [
  {
    path: '',
    component: WarehouseTypeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseTypeRoutingModule {}
