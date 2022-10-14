import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { PaRWhMWarehouseRoutingModule } from './pa-r-wh-m-warehouse-routing.module';
//Components
import { PaRWhCWarehouseReportsComponent } from './warehouse-reports/pa-r-wh-c-warehouse-reports.component';
//@Standalone Components
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';

@NgModule({
  declarations: [PaRWhCWarehouseReportsComponent],
  imports: [
    CommonModule,
    PaRWhMWarehouseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    WarehouseSharedComponent,
    GoodsStatusSharedComponent,
  ],
})
export class PaRWhMWarehouseModule {}
