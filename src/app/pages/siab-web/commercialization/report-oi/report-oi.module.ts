import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { reportOiRoutingModule } from './report-oi-routing.module';
import { reportOiComponent } from './report-oi/report-oi.component';

@NgModule({
  declarations: [reportOiComponent],
  imports: [
    CommonModule,
    reportOiRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class reportOiModule {}
