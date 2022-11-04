import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpPddCDonationProcessesComponent } from './donation-processes/fdp-pdd-c-donation-processes.component';
import { FdpPddMDonationProcessesRoutingModule } from './fdp-pdd-m-donation-processes-routing.module';

@NgModule({
  declarations: [FdpPddCDonationProcessesComponent],
  imports: [CommonModule, FdpPddMDonationProcessesRoutingModule, SharedModule],
})
export class FdpPddMDonationProcessesModule {}
