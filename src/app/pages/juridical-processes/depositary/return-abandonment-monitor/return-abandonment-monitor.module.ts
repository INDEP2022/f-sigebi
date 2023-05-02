import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ReturnAbandonmentMonitorRoutingModule } from './return-abandonment-monitor-routing.module';
import { ModalReasonComponent } from './return-abandonment-monitor/modal-reason.component';
import { ReturnAbandonmentMonitorComponent } from './return-abandonment-monitor/return-abandonment-monitor.component';

@NgModule({
  declarations: [ReturnAbandonmentMonitorComponent, ModalReasonComponent],
  imports: [
    CommonModule,
    ReturnAbandonmentMonitorRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
  ],
})
export class ReturnAbandonmentMonitorModule {}
