import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
//Standalone Components
import { BatchSharedComponent } from 'src/app/@standalone/shared-forms/batch-shared/batch-shared.component';
import { CustomersSharedComponent } from 'src/app/@standalone/shared-forms/customers-shared/customers-shared.component';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
import { PenaltiesTypeSharedComponent } from 'src/app/@standalone/shared-forms/penalties-type-shared/penalties-type-shared.component';
//Routing
import { CustomersPenaltiesRoutingModule } from './customers-penalties-routing.module';
//Components
import { AddPenaltiesComponent } from './add-penalties/add-penalties.component';
import { CustomersPenaltiesComponent } from './customers-penalties/customers-penalties.component';
import { HistoryCustomersPenaltiesComponent } from './customers-penalties/history-customers-penalties/history-customers-penalties.component';

@NgModule({
  declarations: [
    CustomersPenaltiesComponent,
    AddPenaltiesComponent,
    HistoryCustomersPenaltiesComponent,
  ],
  imports: [
    CommonModule,
    CustomersPenaltiesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    EventsSharedComponent,
    CustomersSharedComponent,
    BatchSharedComponent,
    PenaltiesTypeSharedComponent,
  ],
})
export class CustomersPenaltiesModule {}
