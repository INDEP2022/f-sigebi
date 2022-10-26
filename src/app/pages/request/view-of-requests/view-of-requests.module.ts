import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { RequestFormComponent } from './request-form/request-form.component';
import { ViewOfRequestsRoutingModule } from './view-of-requests-routing.module';

@NgModule({
  declarations: [RequestFormComponent],
  imports: [
    CommonModule,
    ViewOfRequestsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
  ],
})
export class ViewOfRequestsModule {}
