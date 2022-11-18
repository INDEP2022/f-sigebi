import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { AnnexJRestitutionFormComponent } from './annex-j-restitution-form/annex-j-restitution-form.component';
import { DataCaptureForEntryOrderFormComponent } from './data-capture-for-entry-order-form/data-capture-for-entry-order-form.component';
import { ListRestitutionsAssetsComponent } from './list-restitutions-assets/list-restitutions-assets.component';
import { PrintReportRestitutionModalComponent } from './print-report-restitution-modal/print-report-restitution-modal.component';
import { RestitutionAssetsNumericOrSortRoutingModule } from './restitution-assets-numeric-or-sort-routing.module';
import { RestitutionOfAssetsComponent } from './restitution-of-assets/restitution-of-assets.component';
import { UploadDocumentAnnexKComponent } from './upload-document-annex-k/upload-document-annex-k.component';

@NgModule({
  declarations: [
    RestitutionOfAssetsComponent,
    ListRestitutionsAssetsComponent,
    DataCaptureForEntryOrderFormComponent,
    UploadDocumentAnnexKComponent,
    PrintReportRestitutionModalComponent,
    AnnexJRestitutionFormComponent,
  ],
  imports: [
    CommonModule,
    RestitutionAssetsNumericOrSortRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedComponentGssModule,
    TabsModule,
  ],
})
export class RestitutionAssetsNumericOrSortModule {}
