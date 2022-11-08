import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestListComponent } from '../view-of-requests/request-list/request-list.component';
import { SharedRequestModule } from './../shared-request/shared-request.module';
import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';
import { AssociateFileComponent } from './tabs/associate-file/associate-file.component';
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
import { EstateDocumentFormComponent } from './tabs/estate-document-form/estate-document-form.component';
import { BtnRequestComponent } from './tabs/expedients-child-tabs-components/btn-request/btn-request.component';
import { DocRequestTabComponent } from './tabs/expedients-child-tabs-components/doc-request-tab/doc-request-tab.component';
import { SeeInformationComponent } from './tabs/expedients-child-tabs-components/doc-request-tab/see-information/see-information.component';
import { ExpedientsRequestTabComponent } from './tabs/expedients-child-tabs-components/expedients-request-tab/expedients-request-tab.component';
import { GeneralDocTabComponent } from './tabs/expedients-child-tabs-components/general-doc-tab/general-doc-tab.component';
import { GoodDocTabComponent } from './tabs/expedients-child-tabs-components/good-doc-tab/good-doc-tab.component';
import { NewDocumentComponent } from './tabs/expedients-child-tabs-components/new-document/new-document.component';
import { RequestOfAssetsComponent } from './tabs/expedients-child-tabs-components/request-of-assets/request-of-assets.component';
import { GeneralDocumentsFormComponent } from './tabs/general-documents-form/general-documents-form.component';
import { AddressTransferorTabComponent } from './tabs/records-of-request-components/address-transferor-tab/address-transferor-tab.component';
import { AssetsComponent } from './tabs/records-of-request-components/assets/assets.component';
import { MenajeComponent } from './tabs/records-of-request-components/records-of-request-child-tabs-components/menaje/menaje.component';
import { SelectAddressComponent } from './tabs/records-of-request-components/records-of-request-child-tabs-components/select-address/select-address.component';
import { RequestRecordTabComponent } from './tabs/records-of-request-components/request-record-tab/request-record-tab.component';
import { RegistrationRequestFormComponent } from './tabs/registration-request-form/registration-request-form.component';
import { RequestDocumentFormComponent } from './tabs/request-document-form/request-document-form.component';
import { SearchDocumentFormComponent } from './tabs/search-document-form/search-document-form.component';
import { ClarificationsComponent } from './tabs/validate-asset-document-components/clarifications/clarifications.component';
import { TransferRequestRoutingModule } from './transfer-request-routing.module';

@NgModule({
  declarations: [
    //RequestFormComponent,
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
    AssetsComponent,
    SelectAddressComponent,
    AddressTransferorTabComponent,
    MenajeComponent,
    ClarificationsComponent,
    RegistrationRequestFormComponent,
    AssociateFileComponent,
    GeneralDocumentsFormComponent,
    RequestDocumentFormComponent,
    EstateDocumentFormComponent,
    SearchDocumentFormComponent,
  ],
  imports: [
    CommonModule,
    TransferRequestRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedRequestModule,
  ],
})
export class TransferRequestModule {}
