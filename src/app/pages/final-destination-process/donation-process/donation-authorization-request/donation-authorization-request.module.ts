import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationAuthorizationRequestRoutingModule } from './donation-authorization-request-routing.module';
import { DonationAuthorizationRequestComponent } from './donation-authorization-request/donation-authorization-request.component';
import { ModalViewComponent } from './modal-view/modal-view.component';

@NgModule({
  declarations: [DonationAuthorizationRequestComponent, ModalViewComponent],
  imports: [
    CommonModule,
    DonationAuthorizationRequestRoutingModule,
    FormsModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class DonationAuthorizationRequestModule {}
