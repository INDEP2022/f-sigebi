import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAddCDonationActsComponent } from './donation-acts/fdp-add-c-donation-acts.component';
import { FdpAddMDonationActsRoutingModule } from './fdp-add-m-donation-acts-routing.module';

@NgModule({
  declarations: [FdpAddCDonationActsComponent],
  imports: [
    CommonModule,
    FdpAddMDonationActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class FdpAddMDonationActsModule {}
