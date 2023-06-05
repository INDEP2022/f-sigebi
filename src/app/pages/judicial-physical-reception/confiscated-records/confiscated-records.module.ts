import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfiscatedRecordsRoutingModule } from './confiscated-records-routing.module';
import { ConfiscatedRecordsComponent } from './confiscated-records.component';
import { EdoFisicoComponent } from './edo-fisico/edo-fisico.component.component';
import { ScanFileSharedComponent } from 'src/app/@standalone/shared-forms/scan-file-shared/scan-file-shared.component';

@NgModule({
  declarations: [ConfiscatedRecordsComponent, EdoFisicoComponent],
  imports: [
    CommonModule,
    ConfiscatedRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    ScanFileSharedComponent
  ],
})
export class ConfiscatedRecordsModule {}
