import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillingMRoutingModule } from './billing-m-routing.module';
import { BillingScreenComponent } from './billing-screen/billing-screen.component';
import { DatCancComponent } from './billing-screen/dat-canc/dat-canc.component';

@NgModule({
  declarations: [BillingScreenComponent, DatCancComponent],
  imports: [
    CommonModule,
    SharedModule,
    BillingMRoutingModule,
    TabsModule,
    FormLoaderComponent,
    AccordionModule,
  ],
})
export class BillingMModule {}
