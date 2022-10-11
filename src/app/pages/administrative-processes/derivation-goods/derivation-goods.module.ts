import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DerivationGoodsRoutingModule } from './derivation-goods-routing.module';
import { DerivationGoodsComponent } from './derivation-goods/derivation-goods.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BulkUploadComponent } from './bulk-upload/bulk-upload.component';


@NgModule({
  declarations: [
    DerivationGoodsComponent,
    BulkUploadComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    DerivationGoodsRoutingModule
  ]
})
export class DerivationGoodsModule { }
