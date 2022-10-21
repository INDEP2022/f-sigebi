import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { RequestRoutingModule } from './request-routing.module';

import {
  BsDatepickerConfig,
  BsDatepickerModule,
} from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [],
  imports: [CommonModule, RequestRoutingModule, BsDatepickerModule.forRoot()],
  providers: [BsDatepickerConfig],
})
export class RequestModule {}
