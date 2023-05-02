import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';

import { ReqCompDocAmpRoutingModule } from './req-comp-doc-amp-routing.module';
import { ReqCompDocAmpComponent } from './req-comp-doc-amp.component';

@NgModule({
  declarations: [ReqCompDocAmpComponent],
  imports: [
    CommonModule,
    ReqCompDocAmpRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class ReqCompDocAmpModule {}
