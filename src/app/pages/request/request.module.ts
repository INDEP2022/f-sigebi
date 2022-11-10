import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RequestRoutingModule } from './request-routing.module';

import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RequestRoutingModule,
    BsDatepickerModule.forRoot(),
    SharedModule,
  ],
  providers: [BsDatepickerConfig],
})
export class RequestModule {}
