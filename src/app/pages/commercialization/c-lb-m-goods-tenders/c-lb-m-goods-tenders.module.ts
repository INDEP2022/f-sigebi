import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { ModalModule } from 'ngx-bootstrap/modal';

import { CLbCGoodsTendersComponent } from './c-lb-c-goods-tenders/c-lb-c-goods-tenders.component';
import { CLbMGoodsTendersRoutingModule } from './c-lb-m-goods-tenders-routing.module';

@NgModule({
  declarations: [CLbCGoodsTendersComponent],
  imports: [
    CommonModule,
    CLbMGoodsTendersRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CLbMGoodsTendersModule {}
