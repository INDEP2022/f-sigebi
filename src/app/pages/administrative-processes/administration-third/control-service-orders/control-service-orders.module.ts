import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ControlServiceOrdersRoutingModule } from './control-service-orders-routing.module';
import { BitacoraComponent } from './control-service-orders/bitacora/bitacora.component';
import { ControlServiceOrdersComponent } from './control-service-orders/control-service-orders.component';
@NgModule({
  declarations: [ControlServiceOrdersComponent, BitacoraComponent],
  imports: [
    CommonModule,
    ControlServiceOrdersRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    AccordionModule,
    FormLoaderComponent,
  ],
})
export class ControlServiceOrdersModule {}
