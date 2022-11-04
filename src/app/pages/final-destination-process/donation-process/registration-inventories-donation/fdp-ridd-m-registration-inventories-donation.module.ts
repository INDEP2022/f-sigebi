import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpRiddMRegistrationInventoriesDonationRoutingModule } from './fdp-ridd-m-registration-inventories-donation-routing.module';
import { FdpRiddCRegistrationInventoriesDonationComponent } from './registration-inventories-donation/fdp-ridd-c-registration-inventories-donation.component';

@NgModule({
  declarations: [FdpRiddCRegistrationInventoriesDonationComponent],
  imports: [
    CommonModule,
    FdpRiddMRegistrationInventoriesDonationRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class FdpRiddMRegistrationInventoriesDonationModule {}
