import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ActDeliveryReceptionRoutingModule } from './act-delivery-reception-routing.module';
import { ActDeliveryReceptionComponent } from './act-delivery-reception/act-delivery-reception.component';

@NgModule({
  declarations: [ActDeliveryReceptionComponent],
  imports: [CommonModule, ActDeliveryReceptionRoutingModule, SharedModule],
})
export class ActDeliveryReceptionModule {}
