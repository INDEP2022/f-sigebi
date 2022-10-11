import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResponseRepuveRoutingModule } from './response-repuve-routing.module';
import { ResponseRepuveListComponent } from './response-repuve-list/response-repuve-list.component';
import { ResponseRepuveFormComponent } from './response-repuve-form/response-repuve-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    ResponseRepuveListComponent,
    ResponseRepuveFormComponent
  ],
  imports: [
    CommonModule,
    ResponseRepuveRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ]
})
export class ResponseRepuveModule { }
