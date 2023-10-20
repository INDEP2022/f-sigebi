import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxCurrencyModule } from 'ngx-currency';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillingMRoutingModule } from './billing-m-routing.module';
import { BillingScreenComponent } from './billing-screen/billing-screen.component';
import { ClientComponent } from './billing-screen/components-table/client/client.component';
import { DatCancComponent } from './billing-screen/dat-canc/dat-canc.component';
import { UpdateDetfacturaComponent } from './billing-screen/update-detfactura/update-detfactura.component';
import { UpdateFacturaComponent } from './billing-screen/update-factura/update-factura.component';

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: false,
};

@NgModule({
  declarations: [
    BillingScreenComponent,
    DatCancComponent,
    UpdateFacturaComponent,
    ClientComponent,
    UpdateDetfacturaComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BillingMRoutingModule,
    TabsModule,
    FormLoaderComponent,
    AccordionModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class BillingMModule {}
