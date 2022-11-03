import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControlServiceOrdersRoutingModule } from './control-service-orders-routing.module';
import { ControlServiceOrdersComponent } from './control-service-orders/control-service-orders.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ControlServiceOrdersComponent
  ],
  imports: [
    CommonModule,
    ControlServiceOrdersRoutingModule,
    SharedModule
  ]
})
export class ControlServiceOrdersModule { }
