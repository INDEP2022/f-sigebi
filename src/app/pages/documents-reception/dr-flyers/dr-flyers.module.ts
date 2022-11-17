import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrFlyersRoutingModule } from './dr-flyers-routing.module';
import { DrFDocumentsReceptionFlyerSelectComponent } from './rd-f-documents-reception-register/components/dr-f-documents-reception-flyer-select/dr-f-documents-reception-flyer-select.component';
import { RdFDocumentsReceptionRegisterComponent } from './rd-f-documents-reception-register/rd-f-documents-reception-register.component';
import { RdFPublicMinistriesComponent } from './rd-f-public-ministries/rd-f-public-ministries.component';
import { RdFRecordUpdateComponent } from './rd-f-record-update/rd-f-record-update.component';
import { RdFRelatedDocumentsComponent } from './rd-f-related-documents/rd-f-related-documents.component';
import { RdFShiftChangeComponent } from './rd-f-shift-change/rd-f-shift-change.component';
import { RdFShitChangeHistoryComponent } from './rd-f-shift-change/rd-f-shit-change-history/rd-f-shit-change-history.component';


@NgModule({
  declarations: [
    RdFDocumentsReceptionRegisterComponent,
    RdFRecordUpdateComponent,
    RdFShiftChangeComponent,
    RdFShitChangeHistoryComponent,
    RdFRelatedDocumentsComponent,
    RdFPublicMinistriesComponent,
    DrFDocumentsReceptionFlyerSelectComponent,

  ],
  imports: [
    CommonModule,
    DrFlyersRoutingModule,
    SharedModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    BsDatepickerModule,
    DocumentsListComponent,
  ],
})
export class DrFlyersModule { }
