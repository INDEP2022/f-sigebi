import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationProcessesRoutingModule } from './donation-processes-routing.module';
import { DonationProcessesComponent } from './donation-processes/donation-processes.component';

@NgModule({
  declarations: [DonationProcessesComponent],
  imports: [CommonModule, DonationProcessesRoutingModule, SharedModule],
})
export class DonationProcessesModule {}
