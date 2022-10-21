import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrFlyersRoutingModule } from './dr-flyers-routing.module';
import { RdFDocumentsReceptionRegisterComponent } from './rd-f-documents-reception-register/rd-f-documents-reception-register.component';
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
  ],
  imports: [
    CommonModule,
    DrFlyersRoutingModule,
    SharedModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    BsDatepickerModule,
  ],
})
export class DrFlyersModule {}
