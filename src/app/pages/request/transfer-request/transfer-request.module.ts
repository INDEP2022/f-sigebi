import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestListComponent } from '../view-of-requests/request-list/request-list.component';
import { UsersSelectedToTurnComponent } from '../view-of-requests/users-selected-to-turn/users-selected-to-turn.component';
import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';
import { AdvancedSearchComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/advanced-search/advanced-search.component';
import { ClarificationFormTabComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/clarification-form-tab/clarification-form-tab.component';
import { ClarificationListTabComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/clarification-list-tab/clarification-list-tab.component';
import { ClassifyAssetsTabComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/classify-assets-tab/classify-assets-tab.component';
import { ClassificationAssetsTabComponent } from './tabs/classify-assets-components/good-classification-tab/classification-assets-tab.component';
import { ExpedientsTabsComponent } from './tabs/compliance-verification-components/expedients-tabs/expedients-tabs.component';
import { RequestDetailTabComponent } from './tabs/compliance-verification-components/request-detail-tab/request-detail-tab.component';
import { SaeInputComponent } from './tabs/compliance-verification-components/verify-compliance-tab/sae-input/sae-input.component';
import { VerifyComplianceTabComponent } from './tabs/compliance-verification-components/verify-compliance-tab/verify-compliance-tab.component';
import { DetailAssetsTabComponentComponent } from './tabs/detail-assets-tab-component/detail-assets-tab-component.component';
import { BtnRequestComponent } from './tabs/expedients-child-tabs-components/btn-request/btn-request.component';
import { DocRequestTabComponent } from './tabs/expedients-child-tabs-components/doc-request-tab/doc-request-tab.component';
import { SeeInformationComponent } from './tabs/expedients-child-tabs-components/doc-request-tab/see-information/see-information.component';
import { ExpedientsRequestTabComponent } from './tabs/expedients-child-tabs-components/expedients-request-tab/expedients-request-tab.component';
import { GeneralDocTabComponent } from './tabs/expedients-child-tabs-components/general-doc-tab/general-doc-tab.component';
import { GoodDocTabComponent } from './tabs/expedients-child-tabs-components/good-doc-tab/good-doc-tab.component';
import { NewDocumentComponent } from './tabs/expedients-child-tabs-components/new-document/new-document.component';
import { RequestOfAssetsComponent } from './tabs/expedients-child-tabs-components/request-of-assets/request-of-assets.component';
import { RequestRecordTabComponent } from './tabs/request-record-tab/request-record-tab.component';

import { TransferRequestRoutingModule } from './transfer-request-routing.module';

@NgModule({
  declarations: [
    //RequestFormComponent,
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
    ClarificationListTabComponent,
    ClarificationFormTabComponent,
  ],
  imports: [
    CommonModule,
    TransferRequestRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
  ],
})
export class TransferRequestModule {}
