import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpSadCDonationAuthorizationRequestComponent } from './donation-authorization-request/fdp-sad-c-donation-authorization-request.component';
import { FdpSadMDonationAuthorizationRequestRoutingModule } from './fdp-sad-m-donation-authorization-request-routing.module';
import { ModalViewComponent } from './modal-view/modal-view.component';

@NgModule({
  declarations: [
    FdpSadCDonationAuthorizationRequestComponent,
    ModalViewComponent,
  ],
  imports: [
    CommonModule,
    FdpSadMDonationAuthorizationRequestRoutingModule,
    FormsModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class FdpSadMDonationAuthorizationRequestModule {}
