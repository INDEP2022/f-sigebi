import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Ng Apexcharts
import { NgApexchartsModule } from 'ng-apexcharts';
//@Standalone Components
import { ContractsSharedComponent } from 'src/app/@standalone/shared-forms/contracts-shared/contracts-shared.component';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';
//Routing
import { PaTpWMWarehouseRoutingModule } from './pa-tp-w-m-warehouse-routing.module';
//Components
import { PaPdCProceedingsDetailsComponent } from './proceedings-details/pa-pd-c-proceedings-details.component';
import { PaRwcCRegWarehouseContractComponent } from './reg-warehouse-contract/pa-rwc-c-reg-warehouse-contract.component';

@NgModule({
  declarations: [
    PaRwcCRegWarehouseContractComponent,
    PaPdCProceedingsDetailsComponent,
  ],
  imports: [
    CommonModule,
    PaTpWMWarehouseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    WarehouseSharedComponent,
    ContractsSharedComponent,
    NgApexchartsModule,
    ModalModule.forChild(),
  ],
})
export class PaTpWMWarehouseModule {}
