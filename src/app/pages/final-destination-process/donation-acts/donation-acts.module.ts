import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationActsRoutingModule } from './donation-acts-routing.module';
import { ConfirmationDonationActsComponent } from './donation-acts/confirmation-donation-acts/confirmation-donation-acts.component';
import { DonationActsComponent } from './donation-acts/donation-acts.component';

@NgModule({
  declarations: [DonationActsComponent, ConfirmationDonationActsComponent],
  imports: [
    CommonModule,
    DonationActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class DonationActsModule {}
