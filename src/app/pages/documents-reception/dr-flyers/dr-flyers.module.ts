import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DrFlyersRoutingModule } from './dr-flyers-routing.module';
import { RdFDocumentsReceptionRegisterComponent } from './rd-f-documents-reception-register/rd-f-documents-reception-register.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RdFRecordUpdateComponent } from './rd-f-record-update/rd-f-record-update.component';
import { RdFShiftChangeComponent } from './rd-f-shift-change/rd-f-shift-change.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RdFShitChangeHistoryComponent } from './rd-f-shift-change/rd-f-shit-change-history/rd-f-shit-change-history.component';
import { RdFRelatedDocumentsComponent } from './rd-f-related-documents/rd-f-related-documents.component';
import { DrFDocumentsReceptionFlyerSelectComponent } from './rd-f-documents-reception-register/components/dr-f-documents-reception-flyer-select/dr-f-documents-reception-flyer-select.component';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';

@NgModule({
  declarations: [
    RdFDocumentsReceptionRegisterComponent,
    RdFRecordUpdateComponent,
    RdFShiftChangeComponent,
    RdFShitChangeHistoryComponent,
    RdFRelatedDocumentsComponent,
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
export class DrFlyersModule {}
