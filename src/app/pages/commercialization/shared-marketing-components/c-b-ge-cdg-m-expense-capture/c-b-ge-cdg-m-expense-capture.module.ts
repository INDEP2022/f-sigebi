import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBGeCdgCExpenseCaptureComponent } from './c-b-ge-cdg-c-expense-capture/c-b-ge-cdg-c-expense-capture.component';
import { CBGeCdgMExpenseCaptureRoutingModule } from './c-b-ge-cdg-m-expense-capture-routing.module';

@NgModule({
  declarations: [CBGeCdgCExpenseCaptureComponent],
  imports: [
    CommonModule,
    CBGeCdgMExpenseCaptureRoutingModule,
    SharedModule,
    BsDatepickerModule,
    UsersSharedComponent,
  ],
})
export class CBGeCdgMExpenseCaptureModule {}
