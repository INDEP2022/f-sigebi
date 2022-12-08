import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsComponent } from './acts/acts.component';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';
import { DerivationGoodsRoutingModule } from './derivation-goods-routing.module';
import { DerivationGoodsComponent } from './derivation-goods/derivation-goods.component';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
//Components
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { GoodsComponent } from './goods/goods.component';

@NgModule({
  declarations: [
    DerivationGoodsComponent,
    BulkUploadComponent,
    ActsComponent,
    GoodsComponent,
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
