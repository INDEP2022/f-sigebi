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
import { WarehouseRoutingModule } from './warehouse-routing.module';
//Components
import { ProceedingsDetailsComponent } from './proceedings-details/proceedings-details.component';
import { RegWarehouseContractComponent } from './reg-warehouse-contract/reg-warehouse-contract.component';

@NgModule({
  declarations: [RegWarehouseContractComponent, ProceedingsDetailsComponent],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    WarehouseSharedComponent,
    ContractsSharedComponent,
    NgApexchartsModule,
    ModalModule.forChild(),
  ],
})
export class WarehouseModule {}
