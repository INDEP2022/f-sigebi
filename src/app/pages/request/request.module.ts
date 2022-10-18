import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestRoutingModule } from './request-routing.module';

import { SharedModule } from 'src/app/shared/shared.module';
import {
  BsDatepickerModule,
  BsDatepickerConfig,
} from 'ngx-bootstrap/datepicker';
import { from } from 'rxjs';

@NgModule({
  declarations: [],
  imports: [CommonModule, RequestRoutingModule, BsDatepickerModule.forRoot()],
  providers: [BsDatepickerConfig],
})
export class RequestModule {}
