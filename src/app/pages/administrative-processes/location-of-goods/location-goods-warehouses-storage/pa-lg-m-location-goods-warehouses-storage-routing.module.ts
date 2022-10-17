import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaLgCLocationGoodsWarehousesStorageComponent } from './pa-lg-c-location-goods-warehouses-storage/pa-lg-c-location-goods-warehouses-storage.component';
import { PaLgCTrackerGoodsComponent } from './pa-lg-c-tracker-goods/pa-lg-c-tracker-goods.component';

const routes: Routes = [
  {
    path: '',
    component: PaLgCLocationGoodsWarehousesStorageComponent,
  },
  {
    path: 'tracker-goods',
    component: PaLgCTrackerGoodsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaLgMLocationGoodsWarehousesStorageRoutingModule {}
