import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { RegistrationOfRequestsComponent } from '../transfer-request/registration-of-requests/registration-of-requests.component';
import { AdvancedSearchComponent } from '../transfer-request/tabs/classify-assets-components/classify-assets-child-tabs-components/advanced-search/advanced-search.component';
import { ClassifyAssetsTabComponent } from '../transfer-request/tabs/classify-assets-components/classify-assets-child-tabs-components/classify-assets-tab/classify-assets-tab.component';
import { ClassificationAssetsTabComponent } from '../transfer-request/tabs/classify-assets-components/good-classification-tab/classification-assets-tab.component';
import { ExpedientsTabsComponent } from '../transfer-request/tabs/compliance-verification-components/expedients-tabs/expedients-tabs.component';
import { RequestDetailTabComponent } from '../transfer-request/tabs/compliance-verification-components/request-detail-tab/request-detail-tab.component';
import { SaeInputComponent } from '../transfer-request/tabs/compliance-verification-components/verify-compliance-tab/sae-input/sae-input.component';
import { VerifyComplianceTabComponent } from '../transfer-request/tabs/compliance-verification-components/verify-compliance-tab/verify-compliance-tab.component';
import { DetailAssetsTabComponentComponent } from '../transfer-request/tabs/detail-assets-tab-component/detail-assets-tab-component.component';
import { BtnRequestComponent } from '../transfer-request/tabs/expedients-child-tabs-components/btn-request/btn-request.component';
import { DocRequestTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/doc-request-tab/doc-request-tab.component';
import { SeeInformationComponent } from '../transfer-request/tabs/expedients-child-tabs-components/doc-request-tab/see-information/see-information.component';
import { ExpedientsRequestTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/expedients-request-tab/expedients-request-tab.component';
import { GeneralDocTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/general-doc-tab/general-doc-tab.component';
import { GoodDocTabComponent } from '../transfer-request/tabs/expedients-child-tabs-components/good-doc-tab/good-doc-tab.component';
import { NewDocumentComponent } from '../transfer-request/tabs/expedients-child-tabs-components/new-document/new-document.component';
import { RequestOfAssetsComponent } from '../transfer-request/tabs/expedients-child-tabs-components/request-of-assets/request-of-assets.component';
import { RequestRecordTabComponent } from '../transfer-request/tabs/records-of-request-components/request-record-tab/request-record-tab.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestListComponent } from './request-list/request-list.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';
import { ViewOfRequestsRoutingModule } from './view-of-requests-routing.module';

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
    AdvancedSearchComponent,
    DetailAssetsTabComponentComponent,
  ],
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
