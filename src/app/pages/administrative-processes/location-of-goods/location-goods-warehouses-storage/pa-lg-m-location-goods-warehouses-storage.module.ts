import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

///Components
import { PaLgMLocationGoodsWarehousesStorageRoutingModule } from './pa-lg-m-location-goods-warehouses-storage-routing.module';
import { PaLgCLocationGoodsWarehousesStorageComponent } from './pa-lg-c-location-goods-warehouses-storage/pa-lg-c-location-goods-warehouses-storage.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaLgCTrackerGoodsComponent } from './pa-lg-c-tracker-goods/pa-lg-c-tracker-goods.component';


@NgModule({
  declarations: [
    PaLgCLocationGoodsWarehousesStorageComponent,
    PaLgCTrackerGoodsComponent
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
    GoodsTypesSharedComponent
  ]
})
export class PaLgMLocationGoodsWarehousesStorageModule { }
