import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocReceptionTrackRecordsModalComponent } from './documents-reception-register/components/doc-reception-track-records-modal/doc-reception-track-records-modal.component';
import { DocumentsReceptionFlyerSelectComponent } from './documents-reception-register/components/documents-reception-flyer-select/documents-reception-flyer-select.component';
import { DocumentsReceptionSelectDocumentsComponent } from './documents-reception-register/components/documents-reception-select-documents/documents-reception-select-documents.component';
import { IDocReceptionndicatedFormComponent } from './documents-reception-register/components/indicated-form/indicated-form.component';
import { DocumentsReceptionRegisterComponent } from './documents-reception-register/documents-reception-register.component';
import { FlyersRoutingModule } from './flyers-routing.module';
import { PublicMinistriesComponent } from './public-ministries/public-ministries.component';
import { RecordUpdateComponent } from './record-update/record-update.component';
import { RelatedDocumentsComponent } from './related-documents/related-documents.component';
import { ShiftChangeHistoryComponent } from './shift-change/shift-change-history/shift-change-history.component';
import { RdFShiftChangeComponent } from './shift-change/shift-change.component';

@NgModule({
  declarations: [
    DocumentsReceptionRegisterComponent,
    RecordUpdateComponent,
    RdFShiftChangeComponent,
    ShiftChangeHistoryComponent,
    RelatedDocumentsComponent,
    PublicMinistriesComponent,
    DocumentsReceptionFlyerSelectComponent,
    DocumentsReceptionSelectDocumentsComponent,
    DocReceptionTrackRecordsModalComponent,
    IDocReceptionndicatedFormComponent,
  ],
  imports: [
    CommonModule,
    FlyersRoutingModule,
    SharedModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    DocumentsListComponent,
    NgScrollbarModule,
    FormLoaderComponent,
  ],
})
export class FlyersModule {}
