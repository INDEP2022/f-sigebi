import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { ResponseRepuveFormComponent } from './response-repuve-form/response-repuve-form.component';
import { ResponseRepuveListComponent } from './response-repuve-list/response-repuve-list.component';
import { ResponseRepuveRoutingModule } from './response-repuve-routing.module';

@NgModule({
  declarations: [ResponseRepuveListComponent, ResponseRepuveFormComponent],
  imports: [
    CommonModule,
    ResponseRepuveRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ResponseRepuveModule {}
