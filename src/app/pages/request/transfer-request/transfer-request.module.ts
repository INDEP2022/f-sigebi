import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestListComponent } from '../view-of-requests/request-list/request-list.component';
import { SharedRequestModule } from './../shared-request/shared-request.module';
import { RegistrationOfRequestsComponent } from './registration-of-requests/registration-of-requests.component';
import { SelectTypeUserComponent } from './select-type-user/select-type-user.component';
import { ApprovalAssetsTabsComponent } from './tabs/approval-requests-components/approval-assets-tabs/approval-assets-tabs.component';
import { GenerateDictumComponent } from './tabs/approval-requests-components/generate-dictum/generate-dictum.component';
import { AssociateFileComponent } from './tabs/associate-file/associate-file.component';
import { OpenDescriptionComponent } from './tabs/associate-file/open-description/open-description.component';
import { AdvancedSearchComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/advanced-search/advanced-search.component';
import { ClarificationFormTabComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/clarification-form-tab/clarification-form-tab.component';
import { ClarificationListTabComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/clarification-list-tab/clarification-list-tab.component';
import { ClassifyAssetsTabComponent } from './tabs/classify-assets-components/classify-assets-child-tabs-components/classify-assets-tab/classify-assets-tab.component';
import { ClassificationAssetsTabComponent } from './tabs/classify-assets-components/good-classification-tab/classification-assets-tab.component';
import { RequestDetailTabComponent } from './tabs/compliance-verification-components/request-detail-tab/request-detail-tab.component';
import { CheckboxComponent } from './tabs/compliance-verification-components/verify-compliance-tab/checkbox/checkbox.component';
import { FulfillmentComponent } from './tabs/compliance-verification-components/verify-compliance-tab/fulfillment/fulfillment.component';
import { SaeInputComponent } from './tabs/compliance-verification-components/verify-compliance-tab/sae-input/sae-input.component';
import { SelectInputComponent } from './tabs/compliance-verification-components/verify-compliance-tab/select-input/select-input.component';
import { VerifyComplianceTabComponent } from './tabs/compliance-verification-components/verify-compliance-tab/verify-compliance-tab.component';
import { EstateDocumentFormComponent } from './tabs/estate-document-form/estate-document-form.component';
import { GeneralDocumentsFormComponent } from './tabs/general-documents-form/general-documents-form.component';
import { InappropriatenessFormComponent } from './tabs/notify-clarifications-impropriety-tabs-component/inappropriateness-form/inappropriateness-form.component';
import { InappropriatenessPgrSatFormComponent } from './tabs/notify-clarifications-impropriety-tabs-component/inappropriateness-pgr-sat-form/inappropriateness-pgr-sat-form.component';
import { InputFieldComponent } from './tabs/notify-clarifications-impropriety-tabs-component/input-field/input-field.component';
import { NotificationAssetsTabComponent } from './tabs/notify-clarifications-impropriety-tabs-component/notification-assets-tab/notification-assets-tab.component';
import { NotifyAssetsImproprietyFormComponent } from './tabs/notify-clarifications-impropriety-tabs-component/notify-assets-impropriety-form/notify-assets-impropriety-form.component';
import { PrintReportModalComponent } from './tabs/notify-clarifications-impropriety-tabs-component/print-report-modal/print-report-modal.component';
import { PrintSatAnswerComponent } from './tabs/notify-clarifications-impropriety-tabs-component/print-sat-answer/print-sat-answer.component';
import { RefuseClarificationModalComponent } from './tabs/notify-clarifications-impropriety-tabs-component/refuse-clarification-modal/refuse-clarification-modal.component';
import { UploadFielsModalComponent } from './tabs/notify-clarifications-impropriety-tabs-component/upload-fiels-modal/upload-fiels-modal.component';
import { AddressTransferorTabComponent } from './tabs/records-of-request-components/address-transferor-tab/address-transferor-tab.component';
import { AssetsComponent } from './tabs/records-of-request-components/assets/assets.component';
import { CopyAddressComponent } from './tabs/records-of-request-components/records-of-request-child-tabs-components/copy-address/copy-address.component';
import { MenajeComponent } from './tabs/records-of-request-components/records-of-request-child-tabs-components/menaje/menaje.component';
import { SelectAddressComponent } from './tabs/records-of-request-components/records-of-request-child-tabs-components/select-address/select-address.component';
import { RequestRecordTabComponent } from './tabs/records-of-request-components/request-record-tab/request-record-tab.component';
import { AssociateFieldComponent } from './tabs/registration-request-form/actions/associate-field/associate-field.component';
import { RegistrationRequestFormComponent } from './tabs/registration-request-form/registration-request-form.component';
import { RequestDocumentFormComponent } from './tabs/request-document-form/request-document-form.component';
import { SearchDocumentFormComponent } from './tabs/search-document-form/search-document-form.component';
import { ClarificationsComponent } from './tabs/validate-asset-document-components/clarifications/clarifications.component';
import { TransferRequestRoutingModule } from './transfer-request-routing.module';

@NgModule({
  declarations: [
    RequestListComponent,
    RegistrationOfRequestsComponent,
    RequestRecordTabComponent,
    RequestDetailTabComponent,
    VerifyComplianceTabComponent,
    SaeInputComponent,
    ClassificationAssetsTabComponent,
    ClassifyAssetsTabComponent,
    AdvancedSearchComponent,
    ClarificationListTabComponent,
    ClarificationFormTabComponent,
    AssetsComponent,
    SelectAddressComponent,
    AddressTransferorTabComponent,
    MenajeComponent,
    ClarificationsComponent,
    NotificationAssetsTabComponent,
    RegistrationRequestFormComponent,
    AssociateFileComponent,
    GeneralDocumentsFormComponent,
    RequestDocumentFormComponent,
    EstateDocumentFormComponent,
    SearchDocumentFormComponent,
    NotifyAssetsImproprietyFormComponent,
    PrintReportModalComponent,
    InputFieldComponent,
    UploadFielsModalComponent,
    RefuseClarificationModalComponent,
    ApprovalAssetsTabsComponent,
    GenerateDictumComponent,
    AssociateFieldComponent,
    SelectTypeUserComponent,
    OpenDescriptionComponent,
    CheckboxComponent,
    CopyAddressComponent,
    FulfillmentComponent,
    PrintSatAnswerComponent,
    SelectInputComponent,
    InappropriatenessPgrSatFormComponent,
    InappropriatenessFormComponent,
  ],
  imports: [
    CommonModule,
    TransferRequestRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedRequestModule,
    PdfViewerModule,
    FormLoaderComponent,
    HttpClientModule,
    TooltipModule,
  ],
  exports: [VerifyComplianceTabComponent],
})
export class TransferRequestModule {}
