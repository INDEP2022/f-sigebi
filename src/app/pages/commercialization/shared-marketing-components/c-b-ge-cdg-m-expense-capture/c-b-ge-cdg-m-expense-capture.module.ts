import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CBGeCdgMExpenseCaptureRoutingModule } from './c-b-ge-cdg-m-expense-capture-routing.module';
import { CBGeCdgCExpenseCaptureComponent } from './c-b-ge-cdg-c-expense-capture/c-b-ge-cdg-c-expense-capture.component';


@NgModule({
  declarations: [
    CBGeCdgCExpenseCaptureComponent
  ],
  imports: [
    CommonModule,
    CBGeCdgMExpenseCaptureRoutingModule,
    SharedModule,
    BsDatepickerModule
  ]
})
export class CBGeCdgMExpenseCaptureModule { }
