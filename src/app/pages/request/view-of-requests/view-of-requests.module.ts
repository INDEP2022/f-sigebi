import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { ViewOfRequestsRoutingModule } from './view-of-requests-routing.module';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestListComponent } from './request-list/request-list.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';
import { RegistrationOfRequestsComponent } from '../transfer-request/registration-of-requests/registration-of-requests.component';
import { RequestRecordTabComponent } from '../transfer-request/tabs/request-record-tab/request-record-tab.component';
import { RequestDetailTabComponent } from '../transfer-request/tabs/compliance-verification-components/request-detail-tab/request-detail-tab.component';
import { ExpedientsTabsComponent } from '../transfer-request/tabs/compliance-verification-components/expedients-tabs/expedients-tabs.component';
import { DocRequestTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/doc-request-tab/doc-request-tab.component';
import { VerifyComplianceTabComponent } from '../transfer-request/tabs/compliance-verification-components/verify-compliance-tab/verify-compliance-tab.component';
import { SimplebarAngularModule } from 'simplebar-angular';
import { GoodDocTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/good-doc-tab/good-doc-tab.component';
import { GeneralDocTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/general-doc-tab/general-doc-tab.component';
import { BtnRequestComponent } from '../transfer-request/tabs/expedients-child-tabs-components/btn-request/btn-request.component';
import { NewDocumentComponent } from '../transfer-request/tabs/expedients-child-tabs-components/new-document/new-document.component';
import { SeeInformationComponent } from '../transfer-request/tabs/expedients-child-tabs-components/doc-request-tab/see-information/see-information.component';
import { SaeInputComponent } from '../transfer-request/tabs/compliance-verification-components/verify-compliance-tab/sae-input/sae-input.component';
import { ExpedientsRequestTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/expedients-request-tab/expedients-request-tab.component';
import { RequestOfAssetsComponent } from '../transfer-request/tabs/expedients-child-tabs-components/request-of-assets/request-of-assets.component';
import { ClassificationAssetsTabComponent } from '../transfer-request/tabs/classify-assets-components/good-classification-tab/classification-assets-tab.component';
import { ClassifyAssetsTabComponent } from '../transfer-request/tabs/classify-assets-components/classify-assets-child-tabs-components/classify-assets-tab/classify-assets-tab.component';

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
    SeeInformationComponent,
    SaeInputComponent,
    ExpedientsRequestTabComponent,
    RequestOfAssetsComponent,
    ClassificationAssetsTabComponent,
    ClassifyAssetsTabComponent,
  ],
  imports: [
    CommonModule,
    ViewOfRequestsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    SimplebarAngularModule,
  ],
})
export class ViewOfRequestsModule {}
