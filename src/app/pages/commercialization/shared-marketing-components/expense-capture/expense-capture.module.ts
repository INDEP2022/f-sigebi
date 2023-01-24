import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExpenseCaptureRoutingModule } from './expense-capture-routing.module';
import { ExpenseCaptureComponent } from './expense-capture/expense-capture.component';

@NgModule({
  declarations: [ExpenseCaptureComponent],
  imports: [
    CommonModule,
    ExpenseCaptureRoutingModule,
    SharedModule,
    BsDatepickerModule,
    UsersSharedComponent,
  ],
})
export class ExpenseCaptureModule {}
