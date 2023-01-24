import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CumulativeGoodsRoutingModule } from './cumulative-goods-routing.module';
import { CumulativeGoodsComponent } from './cumulative-goods/cumulative-goods.component';

@NgModule({
  declarations: [CumulativeGoodsComponent],
  imports: [
    CommonModule,
    CumulativeGoodsRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    ModalModule.forChild(),
  ],
})
export class CumulativeGoodsModule {}
