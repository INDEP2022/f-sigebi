import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrShippingDocumentsRoutingModule } from './dr-shipping-documents-routing.module';
import { DrShippingDocumentsComponent } from './dr-shipping-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
