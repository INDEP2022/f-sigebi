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
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaLgCLocationGoodsWarehousesStorageComponent } from './pa-lg-c-location-goods-warehouses-storage/pa-lg-c-location-goods-warehouses-storage.component';
import { PaLgCModalSelectsGoodsComponent } from './pa-lg-c-modal-selects-goods/pa-lg-c-modal-selects-goods.component';
import { PaLgCTrackerGoodsComponent } from './pa-lg-c-tracker-goods/pa-lg-c-tracker-goods.component';
import { PaLgMLocationGoodsWarehousesStorageRoutingModule } from './pa-lg-m-location-goods-warehouses-storage-routing.module';

@NgModule({
  declarations: [
    PaLgCLocationGoodsWarehousesStorageComponent,
    PaLgCTrackerGoodsComponent,
    PaLgCModalSelectsGoodsComponent,
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
  ],
})
export class PaLgMLocationGoodsWarehousesStorageModule {}
