import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { OutsideTradesRoutingModule } from './outside-trades-routing.module';
import { OutsideTradesComponent } from './outside-trades/outside-trades.component';

@NgModule({
  declarations: [OutsideTradesComponent],
  imports: [
    CommonModule,
    OutsideTradesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class OutsideTradesModule {}
