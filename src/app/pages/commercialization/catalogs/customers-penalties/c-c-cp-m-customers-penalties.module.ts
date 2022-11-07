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
import { CCCpMCustomersPenaltiesRoutingModule } from './c-c-cp-m-customers-penalties-routing.module';
//Components
import { CApCAddPenaltiesComponent } from './add-penalties/c-ap-c-add-penalties.component';
import { CCpCCustomersPenaltiesComponent } from './customers-penalties/c-cp-c-customers-penalties.component';

@NgModule({
  declarations: [CCpCCustomersPenaltiesComponent, CApCAddPenaltiesComponent],
  imports: [
    CommonModule,
    CCCpMCustomersPenaltiesRoutingModule,
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
export class CCCpMCustomersPenaltiesModule {}
