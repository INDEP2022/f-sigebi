import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';
import { DestinationInfoRequestListComponent } from './destination-info-request-list/destination-info-request-list.component';
import { DestinationInfoRequestMainComponent } from './destination-info-request-main/destination-info-request-main.component';
import { DestinationInformationRequestRoutingModule } from './destination-information-request-routing.module';
import { SendRequestEmailComponent } from './send-request-email/send-request-email.component';

@NgModule({
  declarations: [
    DestinationInfoRequestListComponent,
    DestinationInfoRequestMainComponent,
    SendRequestEmailComponent,
  ],
  imports: [
    CommonModule,
    DestinationInformationRequestRoutingModule,
    SharedRequestModule,
    SharedModule,
    NgScrollbarModule,
    TabsModule,
    ModalModule.forChild(),
  ],
})
export class DestinationInformationRequestModule {}
