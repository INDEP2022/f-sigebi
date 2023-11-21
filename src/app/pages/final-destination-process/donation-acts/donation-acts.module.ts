import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DonationActsRoutingModule } from './donation-acts-routing.module';
import { ConfirmationDonationActsComponent } from './donation-acts/confirmation-donation-acts/confirmation-donation-acts.component';
import { CreateActasComponent } from './donation-acts/create-actas/create-actas.component';
import { DonationActsComponent } from './donation-acts/donation-acts.component';
import { SearchActasComponent } from './donation-acts/search-actas/search-actas.component';
import { SearchExpedientComponent } from './donation-acts/search-expedient/search-expedient.component';

@NgModule({
  declarations: [
    DonationActsComponent,
    ConfirmationDonationActsComponent,
    SearchActasComponent,
    CreateActasComponent,
    SearchExpedientComponent,
  ],
  imports: [
    CommonModule,
    DonationActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    AccordionModule,
    TooltipModule,
    FormLoaderComponent,
  ],
})
export class DonationActsModule {}
