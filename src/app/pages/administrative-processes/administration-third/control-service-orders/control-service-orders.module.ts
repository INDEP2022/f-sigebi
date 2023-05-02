import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ControlServiceOrdersRoutingModule } from './control-service-orders-routing.module';
import { ControlServiceOrdersComponent } from './control-service-orders/control-service-orders.component';

@NgModule({
  declarations: [ControlServiceOrdersComponent],
  imports: [CommonModule, ControlServiceOrdersRoutingModule, SharedModule],
})
export class ControlServiceOrdersModule {}
