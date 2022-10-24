import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { StatusCodeFormComponent } from './status-code-form/status-code-form.component';
import { StatusCodeListComponent } from './status-code-list/status-code-list.component';
import { StatusCodeRoutingModule } from './status-code-routing.module';

@NgModule({
  declarations: [StatusCodeListComponent, StatusCodeFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    StatusCodeRoutingModule,
  ],
})
export class StatusCodeModule {}
