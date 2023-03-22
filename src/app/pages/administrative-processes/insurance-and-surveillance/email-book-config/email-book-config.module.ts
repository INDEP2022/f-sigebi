import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailBookConfigRoutingModule } from './email-book-config-routing.module';
import { EmailBookConfigComponent } from './email-book-config/email-book-config.component';

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
    CustomSelectComponent,
  ],
})
export class EmailBookConfigModule {}
