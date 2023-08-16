import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SelectModalTableSharedComponent } from 'src/app/@standalone/shared-forms/select-modal-table-shared/select-modal-table-shared.component';
import { ExpenseConceptsModule } from '../expense-concepts/expense-concepts.module';
import { ExpenseCaptureRoutingModule } from './expense-capture-routing.module';
import { EntryOrdersComponent } from './expense-capture/entry-orders/entry-orders.component';
import { ExpenseCaptureComponent } from './expense-capture/expense-capture.component';
import { DataReceiptComponent } from './expense-capture/expense-comercial/data-receipt/data-receipt.component';
import { ExpenseComercialComponent } from './expense-capture/expense-comercial/expense-comercial.component';
import { ExpenseCompositionComponent } from './expense-capture/expense-composition/expense-composition.component';
import { NotifyComponent } from './expense-capture/notify/notify.component';
import { ScanFilesComponent } from './expense-capture/scan-files/scan-files.component';

@NgModule({
  declarations: [
    ExpenseCaptureComponent,
    ExpenseComercialComponent,
    DataReceiptComponent,
    ExpenseCompositionComponent,
    NotifyComponent,
    EntryOrdersComponent,
    ScanFilesComponent,
  ],
  imports: [
    CommonModule,
    ExpenseCaptureRoutingModule,
    SharedModule,
    AccordionModule,
    BsDatepickerModule,
    UsersSharedComponent,
    ExpenseConceptsModule,
    SelectModalTableSharedComponent,
  ],
})
export class ExpenseCaptureModule {}
