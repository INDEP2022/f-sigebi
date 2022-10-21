import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestListComponent } from './request-list/request-list.component';
import { RequestRecordTabComponent } from './tabs/request-record-tab/request-record-tab.component';
import { TransferRequestRoutingModule } from './transfer-request-routing.module';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    RequestFormComponent,
    UsersSelectedToTurnComponent,
    RequestListComponent,
    RegistrationOfRequestsComponent,
    RequestRecordTabComponent,
  ],
  imports: [
    CommonModule,
    TransferRequestRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
  ],
})
export class TransferRequestModule {}
