import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

///Components
import { StoreModule } from '@ngrx/store';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SafeSharedComponent } from 'src/app/@standalone/shared-forms/safe-shared/safe-shared.component';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';
import { trackedGoodsReducer } from 'src/app/pages/general-processes/goods-tracker/store/goods-tracker.reducer';
import { PaLgMLocationGoodsWarehousesStorageRoutingModule } from './location-goods-warehouses-storage-routing.module';
import { LocationGoodsWarehousesStorageComponent } from './location-goods-warehouses-storage/location-goods-warehouses-storage.component';
import { ModalSelectsGoodsComponent } from './modal-selects-goods/modal-selects-goods.component';

@NgModule({
  declarations: [
    LocationGoodsWarehousesStorageComponent,
    ModalSelectsGoodsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaLgMLocationGoodsWarehousesStorageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
    WarehouseSharedComponent,
    SafeSharedComponent,
    StoreModule.forFeature('trackedGoods', trackedGoodsReducer),
  ],
})
export class PaLgMLocationGoodsWarehousesStorageModule {}
