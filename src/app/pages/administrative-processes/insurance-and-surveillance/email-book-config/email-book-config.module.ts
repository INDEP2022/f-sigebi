import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailBookConfigRoutingModule } from './email-book-config-routing.module';
import { EmailBookConfigComponent } from './email-book-config/email-book-config.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [EmailBookConfigComponent],
  imports: [
    CommonModule,
    EmailBookConfigRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    BsDatepickerModule.forRoot(),
    CollapseModule.forRoot(),
  ],
})
export class EmailBookConfigModule {}
