import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationAuthorizationRequestRoutingModule } from './donation-authorization-request-routing.module';
import { DonationAuthorizationRequestComponent } from './donation-authorization-request/donation-authorization-request.component';
import { FindProposeComponent } from './find-propose/find-propose.component';
import { ModalViewComponent } from './modal-view/modal-view.component';

@NgModule({
  declarations: [
    DonationAuthorizationRequestComponent,
    ModalViewComponent,
    FindProposeComponent,
  ],
  imports: [
    CommonModule,
    DonationAuthorizationRequestRoutingModule,
    FormsModule,
    SharedModule,
    NgScrollbarModule,
    FormLoaderComponent,
  ],
})
export class DonationAuthorizationRequestModule {}
