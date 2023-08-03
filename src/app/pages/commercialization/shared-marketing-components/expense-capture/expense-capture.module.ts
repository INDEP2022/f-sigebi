import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ExpenseCaptureRoutingModule } from './expense-capture-routing.module';
import { ExpenseCaptureComponent } from './expense-capture/expense-capture.component';
import { DataReceiptComponent } from './expense-capture/expense-comercial/data-receipt/data-receipt.component';
import { ExpenseComercialComponent } from './expense-capture/expense-comercial/expense-comercial.component';

@NgModule({
  declarations: [
    ExpenseCaptureComponent,
    ExpenseComercialComponent,
    DataReceiptComponent,
  ],
  imports: [
    CommonModule,
    ExpenseCaptureRoutingModule,
    SharedModule,
    AccordionModule,
    BsDatepickerModule,
    UsersSharedComponent,
  ],
})
export class ExpenseCaptureModule {}
