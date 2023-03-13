import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocationGoodsWarehousesStorageComponent } from './location-goods-warehouses-storage/location-goods-warehouses-storage.component';

const routes: Routes = [
  {
    path: '',
    component: LocationGoodsWarehousesStorageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaLgMLocationGoodsWarehousesStorageRoutingModule {}
