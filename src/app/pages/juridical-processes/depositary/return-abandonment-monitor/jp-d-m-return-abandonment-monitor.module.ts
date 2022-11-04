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
import { JpDMReturnAbandonmentMonitorRoutingModule } from './jp-d-m-return-abandonment-monitor-routing.module';
import { JpDRamCReturnAbandonmentMonitorComponent } from './jp-d-ram-c-return-abandonment-monitor/jp-d-ram-c-return-abandonment-monitor.component';
import { ModalReasonComponent } from './jp-d-ram-c-return-abandonment-monitor/modal-reason.component';

@NgModule({
  declarations: [
    JpDRamCReturnAbandonmentMonitorComponent,
    ModalReasonComponent,
  ],
  imports: [
    CommonModule,
    JpDMReturnAbandonmentMonitorRoutingModule,
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
export class JpDMReturnAbandonmentMonitorModule {}
