import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SirsaeMovementSendingMainComponent } from './sirsae-movement-sending-main/sirsae-movement-sending-main.component';
import { SirsaeMovementSendingRoutingModule } from './sirsae-movement-sending-routing.module';

@NgModule({
  declarations: [SirsaeMovementSendingMainComponent],
  imports: [
    CommonModule,
    SirsaeMovementSendingRoutingModule,
    SharedModule,
    NgScrollbarModule,
    FormLoaderComponent,
  ],
})
export class SirsaeMovementSendingModule {}
