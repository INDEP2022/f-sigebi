import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { InsideTradesRoutingModule } from './inside-trades-routing.module';
import { InsideTradesComponent } from './inside-trades/inside-trades.component';

@NgModule({
  declarations: [InsideTradesComponent],
  imports: [
    CommonModule,
    InsideTradesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class InsideTradesModule {}
