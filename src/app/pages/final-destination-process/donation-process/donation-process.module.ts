import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationProcessRoutingModule } from './donation-process-routing.module';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DonationProcessRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class DonationProcessModule {}
