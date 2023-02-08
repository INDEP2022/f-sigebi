import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SendOfficeCheckboxComponent } from './components/send-office-checkbox/send-office-checkbox.component';
import { ShippingDocumentsDialogComponent } from './components/shipping-documents-dialog/shipping-documents-dialog.component';
import { ShippingDocumentsRoutingModule } from './shipping-documents-routing.module';
import { ShippingDocumentsComponent } from './shipping-documents.component';

@NgModule({
  declarations: [
    ShippingDocumentsComponent,
    SendOfficeCheckboxComponent,
    ShippingDocumentsDialogComponent,
  ],
  imports: [
    CommonModule,
    ShippingDocumentsRoutingModule,
    SharedModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
  ],
})
export class ShippingDocumentsModule {}
