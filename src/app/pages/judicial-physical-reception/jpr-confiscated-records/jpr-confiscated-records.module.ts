import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprConfiscatedRecordsRoutingModule } from './jpr-confiscated-records-routing.module';
import { JprConfiscatedRecordsComponent } from './jpr-confiscated-records.component';

@NgModule({
  declarations: [JprConfiscatedRecordsComponent],
  imports: [
    CommonModule,
    JprConfiscatedRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprConfiscatedRecordsModule {}
