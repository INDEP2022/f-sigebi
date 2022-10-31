import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpCddCDonationContractsComponent } from './donation-contracts/fdp-cdd-c-donation-contracts.component';
import { FdpCddMDonationContractsRoutingModule } from './fdp-cdd-m-donation-contracts-routing.module';
import { ModalSelectRequestsComponent } from './modal-select-requests/modal-select-requests.component';

@NgModule({
  declarations: [FdpCddCDonationContractsComponent, ModalSelectRequestsComponent],
  imports: [
    CommonModule,
    FdpCddMDonationContractsRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class FdpCddMDonationContractsModule {}
