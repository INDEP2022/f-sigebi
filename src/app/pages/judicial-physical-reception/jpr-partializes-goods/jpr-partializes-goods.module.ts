import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprPartializesGoodsRoutingModule } from './jpr-partializes-goods-routing.module';
import { JprPartializesGoodsComponent } from './jpr-partializes-goods.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprPartializesGoodsComponent
  ],
  imports: [
    CommonModule,
    JprPartializesGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprPartializesGoodsModule { }
