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

//Components
import { PaMMassiveReclassificationGoodsRoutingModule } from './pa-m-massive-reclassification-goods-routing.module';
import { PaMrgCMassiveReclassificationGoodsComponent } from './pa-mrg-c-massive-reclassification-goods/pa-mrg-c-massive-reclassification-goods.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaMrgCModalClassificationGoodsComponent } from './pa-mrg-c-modal-classification-goods/pa-mrg-c-modal-classification-goods.component';


@NgModule({
  declarations: [
    PaMrgCMassiveReclassificationGoodsComponent,
    PaMrgCModalClassificationGoodsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMMassiveReclassificationGoodsRoutingModule,
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
export class PaMMassiveReclassificationGoodsModule { }
