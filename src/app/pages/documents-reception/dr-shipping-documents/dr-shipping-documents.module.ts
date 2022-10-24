import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrShippingDocumentsRoutingModule } from './dr-shipping-documents-routing.module';
import { DrShippingDocumentsComponent } from './dr-shipping-documents.component';

@NgModule({
  declarations: [DrShippingDocumentsComponent],
  imports: [
    CommonModule,
    DrShippingDocumentsRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class DrShippingDocumentsModule {}
