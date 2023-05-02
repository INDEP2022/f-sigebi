import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { WarehouseRoutingModule } from './warehouse-routing.module';
//@Standalone Components
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { WarehouseSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-shared/warehouse-shared.component';
//Components
import { WarehouseReportsComponent } from './warehouse-reports/warehouse-reports.component';

@NgModule({
  declarations: [WarehouseReportsComponent],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    WarehouseSharedComponent,
    GoodsStatusSharedComponent,
  ],
})
export class WarehouseModule {}
