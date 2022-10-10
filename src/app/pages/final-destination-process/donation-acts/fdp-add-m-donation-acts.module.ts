import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpAddMDonationActsRoutingModule } from './fdp-add-m-donation-acts-routing.module';
import { FdpAddCDonationActsComponent } from './donation-acts/fdp-add-c-donation-acts.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    FdpAddCDonationActsComponent
  ],
  imports: [
    CommonModule,
    FdpAddMDonationActsRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ]
})
export class FdpAddMDonationActsModule { }
