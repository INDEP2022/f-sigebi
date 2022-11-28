import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { QuillModule } from 'ngx-quill';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssignReceiptFormComponent } from './assign-receipt-form/assign-receipt-form.component';
import { AssociateFileButtonComponent } from './associate-file/associate-file-button/associate-file-button.component';
import { AssociateFileComponent } from './associate-file/associate-file.component';
import { NewFileModalComponent } from './associate-file/new-file-modal/new-file-modal.component';
import { ConfirmProgrammingComponent } from './confirm-programming/confirm-programming.component';
import { CreateDeductivesComponent } from './create-deductives/create-deductives.component';
import { CreateReportComponent } from './create-report/create-report.component';
import { DetailAssetsTabComponentComponent } from './detail-assets-tab-component/detail-assets-tab-component.component';
import { DictumInformationTabComponent } from './dictum-information-tab/dictum-information-tab.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentShowComponent } from './document-show/document-show.component';
import { ElectronicSignatureListComponent } from './electronic-signature-list/electronic-signature-list.component';
import { EventDetailFormComponent } from './event-detail-form/event-detail-form.component';
import { ExpedientsTabsComponent } from './expedients-tabs/expedients-tabs.component';
import { BtnRequestComponent } from './expedients-tabs/sub-tabs/btn-request/btn-request.component';
import { DocRequestTabComponent } from './expedients-tabs/sub-tabs/doc-request-tab/doc-request-tab.component';
import { SeeInformationComponent } from './expedients-tabs/sub-tabs/doc-request-tab/see-information/see-information.component';
import { ExpedientsRequestTabComponent } from './expedients-tabs/sub-tabs/expedients-request-tab/expedients-request-tab.component';
import { GoodDocTabComponent } from './expedients-tabs/sub-tabs/good-doc-tab/good-doc-tab.component';
import { NewDocumentComponent } from './expedients-tabs/sub-tabs/new-document/new-document.component';
import { RequestOfAssetsComponent } from './expedients-tabs/sub-tabs/request-of-assets/request-of-assets.component';
import { GenerateReceiptFormComponent } from './generate-receipt-form/generate-receipt-form.component';
import { GoodsListComponent } from './goods-list/goods-list.component';
import { GuidelinesViewComponent } from './guidelines-view/guidelines-view.component';
import { GuidelinesObservationsComponent } from './guidelines/guidelines-observations/guidelines-observations.component';
import { GuidelinesRevisionViewComponent } from './guidelines/guidelines-revision-view/guidelines-revision-view.component';
import { GuidelinesRevisionComponent } from './guidelines/guidelines-revision/guidelines-revision.component';
import { GuidelinesComponent } from './guidelines/guidelines.component';
import { PhotographyFormComponent } from './photography-form/photography-form.component';
import { RegisterDictumInformationComponent } from './register-dictum-information/register-dictum-information.component';
import { RegisterDictumValidationComponent } from './register-dictum-validation/register-dictum-validation.component';
import { RegisterDocumentationFormComponent } from './register-documentation-form/register-documentation-form.component';
import { RegisterDocumentationViewComponent } from './register-documentation-view/register-documentation-view.component';
import { RejectRequestModalComponent } from './reject-request-modal/reject-request-modal.component';
import { RequestFormComponent } from './request-form/request-form.component';
import { RequestInformationRejectComponent } from './request-information-reject/request-information-reject.component';
import { RequestInformationSimilarGoodsComponent } from './request-information-similar-goods/request-information-similar-goods.component';
import { RequestInformationComponent } from './request-information/request-information.component';
import { RequestSiabFormComponent } from './request-siab-form/request-siab-form.component';
import { SearchInventoryGoodsComponent } from './search-inventory-goods/search-inventory-goods.component';
import { SearchRequestSimilarGoodsComponent } from './search-request-similar-goods/search-request-similar-goods.component';
import { SearchRequestsComponent } from './search-requests/search-requests.component';
import { AddGoodsButtonComponent } from './select-goods/add-goods-button/add-goods-button.component';
import { ReserveGoodModalComponent } from './select-goods/reserve-good-modal/reserve-good-modal.component';
import { SelectGoodsComponent } from './select-goods/select-goods.component';
import { ViewFileButtonComponent } from './select-goods/view-file-button/view-file-button.component';
import { ShowProgrammingComponent } from './show-programming/show-programming.component';
import { ShowSignatureProgrammingComponent } from './show-signature-programming/show-signature-programming.component';
import { UploadFilesFormComponent } from './upload-files-form/upload-files-form.component';
import { UsersSelectedToTurnComponent } from './users-selected-to-turn/users-selected-to-turn.component';
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
    DictumInformationTabComponent,
    RegisterDictumInformationComponent,
    RegisterDictumValidationComponent,
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
    DictumInformationTabComponent,
    RegisterDictumInformationComponent,
    RegisterDictumValidationComponent,
  ],
})
export class SharedRequestModule {}
