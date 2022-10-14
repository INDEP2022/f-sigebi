import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

import { CBFFmdvdbMEventPreparationRoutingModule } from './c-b-f-fmdvdb-m-event-preparation-routing.module';
import { CBFFmdvdbCEventPreparationComponent } from './c-b-f-fmdvdb-c-event-preparation/c-b-f-fmdvdb-c-event-preparation.component';
import { SelectEventModalComponent } from './select-event-modal/select-event-modal.component';

@NgModule({
  declarations: [
    CBFFmdvdbCEventPreparationComponent,
    SelectEventModalComponent,
  ],
  imports: [
    CommonModule,
    CBFFmdvdbMEventPreparationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CBFFmdvdbMEventPreparationModule {}
