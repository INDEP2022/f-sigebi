import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterEntrAndRecepComponent } from '../components/capture-filter-entr-and-recep/capture-filter-entr-and-recep.component';
import { ReceptionAndDeliveryRoutingModule } from './reception-and-delivery-routing.module';
import { ReceptionAndDeliveryComponent } from './reception-and-delivery/reception-and-delivery.component';

@NgModule({
  declarations: [ReceptionAndDeliveryComponent],
  imports: [
    CommonModule,
    ReceptionAndDeliveryRoutingModule,
    SharedModule,
    CaptureFilterEntrAndRecepComponent,
  ],
})
export class ReceptionAndDeliveryModule {}
