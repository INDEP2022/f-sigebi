import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';
import { NewTransferRequestComponent } from './new-transfer-request/new-transfer-request.component';
import { ViewOfRequestsRoutingModule } from './view-of-requests-routing.module';

@NgModule({
  declarations: [NewTransferRequestComponent],
  imports: [
    CommonModule,
    ViewOfRequestsRoutingModule,
    SharedModule,
    SharedRequestModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
  ],
})
export class ViewOfRequestsModule {}
