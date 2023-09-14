import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NewAndUpdateComponent } from './sirsae-movement-sending-main/new-and-update/new-and-update.component';
import { SirsaeMovementSendingMainComponent } from './sirsae-movement-sending-main/sirsae-movement-sending-main.component';
import { SirsaeMovementSendingRoutingModule } from './sirsae-movement-sending-routing.module';
@NgModule({
  declarations: [SirsaeMovementSendingMainComponent, NewAndUpdateComponent],
  imports: [
    CommonModule,
    SirsaeMovementSendingRoutingModule,
    SharedModule,
    NgScrollbarModule,
    FormLoaderComponent,
    TooltipModule,
    AccordionModule,
  ],
})
export class SirsaeMovementSendingModule {}
