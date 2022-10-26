import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';

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
