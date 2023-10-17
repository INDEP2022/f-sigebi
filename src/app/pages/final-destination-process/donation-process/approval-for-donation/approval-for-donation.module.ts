import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationAuthorizationRequestModule } from '../donation-authorization-request/donation-authorization-request.module';
import { ApprovalForDonationRoutingModule } from './approval-for-donation-routing.module';
import { ApprovalForDonationComponent } from './approval-for-donation/approval-for-donation.component';
import { CaptureApprovalDonationComponent } from './capture-approval-donation/capture-approval-donation.component';
import { CreateActaComponent } from './create-acta/create-acta.component';
import { FindActaComponent } from './find-acta/find-acta.component';
import { GoodErrorComponent } from './good-error/good-error.component';
import { ModalApprovalDonationComponent } from './modal-approval-donation/modal-approval-donation.component';
@NgModule({
  declarations: [
    ApprovalForDonationComponent,
    CaptureApprovalDonationComponent,
    ModalApprovalDonationComponent,
    FindActaComponent,
    CreateActaComponent,
    GoodErrorComponent,
  ],
  imports: [
    CommonModule,
    ApprovalForDonationRoutingModule,
    SharedModule,
    FormsModule,
    FormLoaderComponent,
    DonationAuthorizationRequestModule,
  ],
  exports: [ModalApprovalDonationComponent],
})
export class ApprovalForDonationModule {}
