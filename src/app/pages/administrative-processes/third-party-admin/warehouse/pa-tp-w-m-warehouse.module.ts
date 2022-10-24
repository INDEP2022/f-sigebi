import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaTpWMWarehouseRoutingModule } from './pa-tp-w-m-warehouse-routing.module';
import { PaRwcCRegWarehouseContractComponent } from './reg-warehouse-contract/pa-rwc-c-reg-warehouse-contract.component';


@NgModule({
  declarations: [
    PaRwcCRegWarehouseContractComponent
  ],
  imports: [
    CommonModule,
    PaTpWMWarehouseRoutingModule
  ]
})
export class PaTpWMWarehouseModule { }
