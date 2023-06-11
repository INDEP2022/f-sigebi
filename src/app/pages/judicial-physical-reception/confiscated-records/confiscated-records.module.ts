import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ScanFileSharedComponent } from 'src/app/@standalone/shared-forms/scan-file-shared/scan-file-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfiscatedRecordsRoutingModule } from './confiscated-records-routing.module';
import { ConfiscatedRecordsComponent } from './confiscated-records.component';
import { EdoFisicoComponent } from './edo-fisico/edo-fisico.component.component';
import { OptionsHistoryGoodDelegation } from './options-history-good-delegation/options-history-good-delegation.components';

@NgModule({
  declarations: [
    ConfiscatedRecordsComponent,
    EdoFisicoComponent,
    OptionsHistoryGoodDelegation,
  ],
  imports: [
    CommonModule,
    ConfiscatedRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    ScanFileSharedComponent,
  ],
})
export class ConfiscatedRecordsModule {}
