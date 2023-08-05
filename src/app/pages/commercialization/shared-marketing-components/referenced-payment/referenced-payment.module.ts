import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { ReferencedPaymentRoutingModule } from './referenced-payment-routing.module';
//Components
import { ReferencedPaymentComponent } from './referenced-payment/referenced-payment.component';
//@Standalone Components
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
import { ListReferenceComponent } from './referenced-payment/list-reference/list-reference.component';
import { NewAndUpdateComponent } from './referenced-payment/new-and-update/new-and-update.component';

@NgModule({
  declarations: [
    ReferencedPaymentComponent,
    NewAndUpdateComponent,
    ListReferenceComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReferencedPaymentRoutingModule,
    EventsSharedComponent,
    BanksSharedComponent,
    FormLoaderComponent,
  ],
})
export class ReferencedPaymentModule {}
