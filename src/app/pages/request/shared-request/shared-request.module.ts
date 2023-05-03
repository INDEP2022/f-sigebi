import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'src/app/utils/file-upload/file-upload.module';
import { SelectUnitModalComponent } from '../transfer-request/tabs/compliance-verification-components/verify-compliance-tab/select-unit-modal/select-unit-modal.component';
import { AssignReceiptFormComponent } from './assign-receipt-form/assign-receipt-form.component';
import { AssociateFileButtonComponent } from './associate-file/associate-file-button/associate-file-button.component';
import { AssociateFileComponent } from './associate-file/associate-file.component';
import { NewFileModalComponent } from './associate-file/new-file-modal/new-file-modal.component';
import { ClassificateVehicleFormComponent } from './classificate-vehicle-form/classificate-vehicle-form.component';
import { CommentsFormComponent } from './comments-form/comments-form.component';
import { ComplementaryRequestInformationComponent } from './complementary-request-information/complementary-request-information.component';
import { ConfirmProgrammingComponent } from './confirm-programming/confirm-programming.component';
import { CreateDeductivesComponent } from './create-deductives/create-deductives.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { DetailAssetsTabComponentComponent } from './detail-assets-tab-component/detail-assets-tab-component.component';
import { ReadInfoDomicileComponent } from './detail-assets-tab-component/read-info-domicile/read-info-domicile.component';
import { ReadInfoGoodComponent } from './detail-assets-tab-component/read-info-good/read-info-good.component';
import { ReadInfoVehicleComponent } from './detail-assets-tab-component/read-info-vehicle/read-info-vehicle.component';
import { DictumInformationComponent } from './dictum-information/dictum-information.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentShowComponent } from './document-show/document-show.component';
import { ElectronicSignatureListComponent } from './electronic-signature-list/electronic-signature-list.component';
import { EventDetailFormComponent } from './event-detail-form/event-detail-form.component';
import { ExpedientsTabsComponent } from './expedients-tabs/expedients-tabs.component';
import { BtnRequestComponent } from './expedients-tabs/sub-tabs/btn-request/btn-request.component';
import { DocRequestTabComponent } from './expedients-tabs/sub-tabs/doc-request-tab/doc-request-tab.component';
import { SeeInformationComponent } from './expedients-tabs/sub-tabs/doc-request-tab/see-information/see-information.component';
import { DocExpedientTabComponent } from './expedients-tabs/sub-tabs/expedients-request-tab/doc-expedient-tab/doc-expedient-tab.component';
import { ExpedientsRequestTabComponent } from './expedients-tabs/sub-tabs/expedients-request-tab/expedients-request-tab.component';
import { GoodDocTabComponent } from './expedients-tabs/sub-tabs/good-doc-tab/good-doc-tab.component';
import { ShowDocumentsGoodComponent } from './expedients-tabs/sub-tabs/good-doc-tab/show-documents-good/show-documents-good.component';
import { NewDocumentComponent } from './expedients-tabs/sub-tabs/new-document/new-document.component';
import { PhotosActionComponent } from './expedients-tabs/sub-tabs/photos-assets/actions/see-action/photos-action.component';
import { SeePhotoComponent } from './expedients-tabs/sub-tabs/photos-assets/actions/see-photo/see-photo.component';
import { OpenPhotosComponent } from './expedients-tabs/sub-tabs/photos-assets/open-photos/open-photos.component';
import { PhotosAssetsComponent } from './expedients-tabs/sub-tabs/photos-assets/photos-assets.component';
import { UploadFileComponent } from './expedients-tabs/sub-tabs/photos-assets/upload-file/upload-file.component';
import { RequestOfAssetsComponent } from './expedients-tabs/sub-tabs/request-of-assets/request-of-assets.component';
import { GenerateReceiptFormComponent } from './generate-receipt-form/generate-receipt-form.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GoodsNotTransferredComponent } from './goods-not-transferred/goods-not-transferred.component';
import { ModalNotTransferredComponent } from './goods-not-transferred/modal-not-transferred/modal-not-transferred.component';
import { GuidelinesViewComponent } from './guidelines-view/guidelines-view.component';
import { GuidelinesObservationsComponent } from './guidelines/guidelines-observations/guidelines-observations.component';
import { GuidelinesRevisionViewComponent } from './guidelines/guidelines-revision-view/guidelines-revision-view.component';
import { GuidelinesRevisionComponent } from './guidelines/guidelines-revision/guidelines-revision.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { OrderServiceFormComponent } from './order-service-form/order-service-form.component';
import { PhotographyFormComponent } from './photography-form/photography-form.component';
import { RegisterComplementaryDocumentationComponent } from './register-complementary-documentation/register-complementary-documentation.component';
import { RegisterDictumInfComponent } from './register-dictum-inf/register-dictum-inf.component';
import { RegisterDictumValComponent } from './register-dictum-val/register-dictum-val.component';
import { RegisterDocumentationFormComponent } from './register-documentation-form/register-documentation-form.component';
import { RegisterDocumentationViewComponent } from './register-documentation-view/register-documentation-view.component';
import { RejectRequestModalComponent } from './reject-request-modal/reject-request-modal.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestInformationRejectComponent } from './request-information-reject/request-information-reject.component';
import { RequestInformationSimilarGoodsComponent } from './request-information-similar-goods/request-information-similar-goods.component';
import { RequestInformationComponent } from './request-information/request-information.component';
import { RequestSiabFormComponent } from './request-siab-form/request-siab-form.component';
import { ResultVisitsComponent } from './result-visits/result-visits.component';
import { SearchInventoryGoodsComponent } from './search-inventory-goods/search-inventory-goods.component';
import { SearchRequestSimilarGoodsComponent } from './search-request-similar-goods/search-request-similar-goods.component';
import { SearchRequestsComponent } from './search-requests/search-requests.component';
import { AddGoodsButtonComponent } from './select-goods/add-goods-button/add-goods-button.component';
import { ReserveGoodModalComponent } from './select-goods/reserve-good-modal/reserve-good-modal.component';
import { SelectGoodsComponent } from './select-goods/select-goods.component';
import { ViewFileButtonComponent } from './select-goods/view-file-button/view-file-button.component';
import { ModalAssignGoodGrouperComponent } from './select-similar-goods/modal-assign-good-grouper/modal-assign-good-grouper.component';
import { ModalModifyDatesComponent } from './select-similar-goods/modal-modify-dates/modal-modify-dates.component';
import { SelectSimilarGoodsComponent } from './select-similar-goods/select-similar-goods.component';
import { ServiceTransportableGoodsFormComponent } from './service-transportable-goods-form/service-transportable-goods-form.component';
import { ShowProgrammingComponent } from './show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from './show-signature-programming/show-signature-programming.component';
import { SignReportComponent } from './sign-report/sign-report.component';
import { SignatureTypeComponent } from './signature-type/signature-type.component';
import { UploadElectronicSignatureComponent } from './upload-electronic-signature/upload-electronic-signature.component';
import { UploadFilesFormComponent } from './upload-files-form/upload-files-form.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';
import { ConfirmValidationComponent } from './validate-visit-result/confirm-validation/confirm-validation.component';
import { ValidateVisitResultComponent } from './validate-visit-result/validate-visit-result.component';
import { ViewExpedientComponent } from './validate-visit-result/view-expedient/view-expedient.component';
import { CheckVerifyComplianceComponent } from './verify-compliance-goods/check-verify-compliance/check-verify-compliance.component';
import { VerifyComplianceGoodsComponent } from './verify-compliance-goods/verify-compliance-goods.component';
import { ViewDocumentsComponent } from './view-documents/view-documents.component';
import { ViewReportComponent } from './view-report/view-report.component';
import { WarehouseConfirmComponent } from './warehouse-confirm/warehouse-confirm.component';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';
import { WarehouseShowComponent } from './warehouse-show/warehouse-show.component';
import { WitnessFormComponent } from './witness-form/witness-form.component';

@NgModule({
  declarations: [
    RequestFormComponent,
    UsersSelectedToTurnComponent,
    RequestInformationComponent,
    AssociateFileComponent,
    NewFileModalComponent,
    SearchRequestsComponent,
    AssociateFileComponent,
    AssociateFileButtonComponent,
    SearchInventoryGoodsComponent,
    SelectGoodsComponent,
    AddGoodsButtonComponent,
    ViewFileButtonComponent,
    ReserveGoodModalComponent,
    PhotographyFormComponent,
    RequestSiabFormComponent,
    DocumentFormComponent,
    DocumentShowComponent,
    ConfirmProgrammingComponent,
    ElectronicSignatureListComponent,
    UploadFilesFormComponent,
    ShowSignatureProgrammingComponent,
    ShowProgrammingComponent,
    WarehouseFormComponent,
    WarehouseConfirmComponent,
    WarehouseShowComponent,
    GenerateReceiptFormComponent,
    AssignReceiptFormComponent,
    WitnessFormComponent,
    ExpedientsTabsComponent,
    DocRequestTabComponent,
    SeeInformationComponent,
    GoodDocTabComponent,
    ExpedientsRequestTabComponent,
    RequestOfAssetsComponent,
    BtnRequestComponent,
    NewDocumentComponent,
    DetailAssetsTabComponentComponent,
    RegisterDocumentationViewComponent,
    GoodsListComponent,
    GuidelinesComponent,
    RequestInformationSimilarGoodsComponent,
    GuidelinesRevisionComponent,
    GuidelinesObservationsComponent,
    GuidelinesRevisionViewComponent,
    RequestInformationRejectComponent,
    GuidelinesViewComponent,
    RegisterDocumentationFormComponent,
    CreateDeductivesComponent,
    CreateReportComponent,
    EventDetailFormComponent,
    RejectRequestModalComponent,
    SearchRequestSimilarGoodsComponent,
    ViewReportComponent,
    DictumInformationComponent,
    RegisterDictumInfComponent,
    RegisterDictumValComponent,
    SignReportComponent,
    ClassificateVehicleFormComponent,
    CommentsFormComponent,
    OrderServiceFormComponent,
    ServiceTransportableGoodsFormComponent,
    VerifyComplianceGoodsComponent,
    CheckVerifyComplianceComponent,
    SignatureTypeComponent,
    UploadElectronicSignatureComponent,
    ComplementaryRequestInformationComponent,
    SelectSimilarGoodsComponent,
    RegisterComplementaryDocumentationComponent,
    ModalAssignGoodGrouperComponent,
    ModalModifyDatesComponent,
    GoodsNotTransferredComponent,
    ModalNotTransferredComponent,
    ValidateVisitResultComponent,
    ConfirmValidationComponent,
    ViewExpedientComponent,
    PhotosAssetsComponent,
    PhotosActionComponent,
    UploadFileComponent,
    OpenPhotosComponent,
    SeePhotoComponent,
    ResultVisitsComponent,
    ShowDocumentsGoodComponent,
    DocExpedientTabComponent,
    ViewDocumentsComponent,
    ReadInfoGoodComponent,
    SelectUnitModalComponent,
    ReadInfoDomicileComponent,
    ReadInfoVehicleComponent,
  ],
  imports: [
    CommonModule,
    ModalModule.forChild(),
    TabsModule,
    SharedModule,
    NgScrollbarModule,
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    QuillModule.forRoot(),
    FileUploadModule,
    PdfViewerModule,
    FormLoaderComponent,
  ],
  exports: [
    RequestFormComponent,
    UsersSelectedToTurnComponent,
    RequestInformationComponent,
    AssociateFileComponent,
    SelectGoodsComponent,
    ExpedientsTabsComponent,
    DocRequestTabComponent,
    SeeInformationComponent,
    GoodDocTabComponent,
    ExpedientsRequestTabComponent,
    RequestOfAssetsComponent,
    BtnRequestComponent,
    NewDocumentComponent,
    DetailAssetsTabComponentComponent,
    RegisterDocumentationViewComponent,
    GoodsListComponent,
    GuidelinesComponent,
    RequestInformationSimilarGoodsComponent,
    SearchInventoryGoodsComponent,
    RequestInformationRejectComponent,
    GuidelinesViewComponent,
    RegisterDocumentationFormComponent,
    EventDetailFormComponent,
    CreateDeductivesComponent,
    RejectRequestModalComponent,
    SearchRequestSimilarGoodsComponent,
    ViewReportComponent,
    DictumInformationComponent,
    RegisterDictumInfComponent,
    RegisterDictumValComponent,
    ClassificateVehicleFormComponent,
    CommentsFormComponent,
    OrderServiceFormComponent,
    ServiceTransportableGoodsFormComponent,
    VerifyComplianceGoodsComponent,
    ModalAssignGoodGrouperComponent,
    ComplementaryRequestInformationComponent,
    GoodsNotTransferredComponent,
    ModalNotTransferredComponent,
  ],
})
export class SharedRequestModule {}
