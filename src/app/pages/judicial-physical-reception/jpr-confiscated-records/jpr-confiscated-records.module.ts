import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprConfiscatedRecordsRoutingModule } from './jpr-confiscated-records-routing.module';
import { JprConfiscatedRecordsComponent } from './jpr-confiscated-records.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprConfiscatedRecordsComponent
  ],
  imports: [
    CommonModule,
    JprConfiscatedRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprConfiscatedRecordsModule { }
