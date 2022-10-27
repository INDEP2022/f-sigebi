import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAdpdtDetailDelegationsComponent } from './detail-delegations/fdp-adpdt-detail-delegations.component';
import { ImpressionOfActsComponent } from './impression-of-acts/impression-of-acts.component';
import { SharedFinalDestinationRoutingModule } from './shared-final-destination-routing.module';

@NgModule({
  declarations: [ImpressionOfActsComponent, FdpAdpdtDetailDelegationsComponent],
  imports: [
    CommonModule,
    SharedFinalDestinationRoutingModule,
    SharedModule,
    FormsModule,
  ],
  exports: [ImpressionOfActsComponent, FdpAdpdtDetailDelegationsComponent],
})
export class SharedFinalDestinationModule {}
