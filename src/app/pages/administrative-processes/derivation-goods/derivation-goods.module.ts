import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { DerivationGoodsRoutingModule } from './derivation-goods-routing.module';
import { DerivationGoodsComponent } from './derivation-goods/derivation-goods.component';
import { PaDgCActsComponent } from './pa-dg-c-acts/pa-dg-c-acts.component';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
//Components
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaDgCGoodsComponent } from './pa-dg-c-goods/pa-dg-c-goods.component';

@NgModule({
  declarations: [
    DerivationGoodsComponent,
    BulkUploadComponent,
    PaDgCActsComponent,
    PaDgCGoodsComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    DerivationGoodsRoutingModule,
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
export class DerivationGoodsModule {}
