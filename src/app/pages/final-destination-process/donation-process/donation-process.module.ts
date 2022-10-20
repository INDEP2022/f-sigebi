import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DonationProcessRoutingModule } from './donation-process-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

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
