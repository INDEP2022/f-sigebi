import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { ShippingDocumentsRoutingModule } from './shipping-documents-routing.module';
import { ShippingDocumentsComponent } from './shipping-documents.component';

@NgModule({
  declarations: [ShippingDocumentsComponent],
  imports: [
    CommonModule,
    ShippingDocumentsRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class ShippingDocumentsModule {}
