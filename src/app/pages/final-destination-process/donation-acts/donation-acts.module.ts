import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationActsRoutingModule } from './donation-acts-routing.module';
import { DonationActsComponent } from './donation-acts/donation-acts.component';

@NgModule({
  declarations: [DonationActsComponent],
  imports: [
    CommonModule,
    DonationActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
  ],
})
export class DonationActsModule {}
