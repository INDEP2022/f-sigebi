import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatusCodeRoutingModule } from './status-code-routing.module';
import { StatusCodeListComponent } from './status-code-list/status-code-list.component';
import { StatusCodeFormComponent } from './status-code-form/status-code-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    StatusCodeListComponent,
    StatusCodeFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StatusCodeRoutingModule
  ]
})
export class StatusCodeModule { }
