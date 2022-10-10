import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';
import { BsDatepickerModule, BsDatepickerConfig  } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RequestRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  providers: [BsDatepickerConfig]
})
export class RequestModule { }
