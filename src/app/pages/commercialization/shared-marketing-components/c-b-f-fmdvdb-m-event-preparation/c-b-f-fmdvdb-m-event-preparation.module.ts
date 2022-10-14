import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ExcelService } from 'src/app/common/services/exportToExcel.service';

import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

import { CBFFmdvdbMEventPreparationRoutingModule } from './c-b-f-fmdvdb-m-event-preparation-routing.module';
import { CBFFmdvdbCEventPreparationComponent } from './c-b-f-fmdvdb-c-event-preparation/c-b-f-fmdvdb-c-event-preparation.component';
import { SelectEventModalComponent } from './select-event-modal/select-event-modal.component';
import { CreateNewEventModalComponent } from './create-new-event-modal/create-new-event-modal.component';
import { AddEditLoteModalComponent } from './add-edit-lote-modal/add-edit-lote-modal.component';

@NgModule({
  declarations: [
    CBFFmdvdbCEventPreparationComponent,
    SelectEventModalComponent,
    CreateNewEventModalComponent,
    AddEditLoteModalComponent
  ],
  imports: [
    CommonModule,
    CBFFmdvdbMEventPreparationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    EventsSharedComponent
  ],
  providers: [ExcelService], 
})
export class CBFFmdvdbMEventPreparationModule {}
