import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferRequestRoutingModule } from './transfer-request-routing.module';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestListComponent } from './request-list/request-list.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';
import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';
import { RequestRecordTabComponent } from './tabs/request-record-tab/request-record-tab.component';
import { RequestDetailTabComponent } from './tabs/compliance-verification-tabs/request-detail-tab/request-detail-tab.component';
import { ExpedientsTabsComponent } from './tabs/compliance-verification-tabs/expedients-tabs/expedients-tabs.component';
import { DocRequestTabComponent } from './tabs/expedients-childTabs/doc-request-tab/doc-request-tab.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { VerifyComplianceTabComponent } from './tabs/compliance-verification-tabs/verify-compliance-tab/verify-compliance-tab.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { GoodDocTabComponent } from './tabs/expedients-childTabs/good-doc-tab/good-doc-tab.component';
import { GeneralDocTabComponent } from './tabs/expedients-childTabs/general-doc-tab/general-doc-tab.component';
import { BtnRequestComponent } from './tabs/expedients-childTabs/btn-request/btn-request.component';
import { NewDocumentComponent } from './tabs/expedients-childTabs/new-document/new-document.component';

@NgModule({
  declarations: [
    RequestFormComponent,
    UsersSelectedToTurnComponent,
    RequestListComponent,
    RegistrationOfRequestsComponent,
    RequestRecordTabComponent,
    RequestDetailTabComponent,
    VerifyComplianceTabComponent,
    ExpedientsTabsComponent,
    DocRequestTabComponent,
    GoodDocTabComponent,
    GeneralDocTabComponent,
    BtnRequestComponent,
    NewDocumentComponent,
  ],
  imports: [
    CommonModule,
    TransferRequestRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    SimplebarAngularModule,
  ],
})
export class TransferRequestModule {}
