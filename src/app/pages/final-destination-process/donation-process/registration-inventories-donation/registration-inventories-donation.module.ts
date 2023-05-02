import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListDonationComponent } from './list-donation/list-donation.component';
import { RegistrationInventoriesDonationRoutingModule } from './registration-inventories-donation-routing.module';
import { RegistrationInventoriesDonationComponent } from './registration-inventories-donation/registration-inventories-donation.component';

@NgModule({
  declarations: [
    RegistrationInventoriesDonationComponent,
    ListDonationComponent,
  ],
  imports: [
    CommonModule,
    RegistrationInventoriesDonationRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class RegistrationInventoriesDonationModule {}
