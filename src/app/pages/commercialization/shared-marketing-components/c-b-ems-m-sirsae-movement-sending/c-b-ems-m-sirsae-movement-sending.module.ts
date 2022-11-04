import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CBEmsCSirsaeMovementSendingMainComponent } from './c-b-ems-c-sirsae-movement-sending-main/c-b-ems-c-sirsae-movement-sending-main.component';
import { CBEmsMSirsaeMovementSendingRoutingModule } from './c-b-ems-m-sirsae-movement-sending-routing.module';

@NgModule({
  declarations: [CBEmsCSirsaeMovementSendingMainComponent],
  imports: [
    CommonModule,
    CBEmsMSirsaeMovementSendingRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class CBEmsMSirsaeMovementSendingModule {}
