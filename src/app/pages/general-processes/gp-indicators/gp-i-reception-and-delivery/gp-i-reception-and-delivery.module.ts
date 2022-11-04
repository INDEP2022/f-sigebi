import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpCaptureFilterComponent } from '../components/gp-capture-filter/gp-capture-filter.component';
import { GpIReceptionAndDeliveryRoutingModule } from './gp-i-reception-and-delivery-routing.module';
import { GpIReceptionAndDeliveryComponent } from './gp-i-reception-and-delivery/gp-i-reception-and-delivery.component';

@NgModule({
  declarations: [GpIReceptionAndDeliveryComponent],
  imports: [
    CommonModule,
    GpIReceptionAndDeliveryRoutingModule,
    SharedModule,
    GpCaptureFilterComponent,
  ],
})
export class GpIReceptionAndDeliveryModule {}
