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
import { AbandonmentMonitorForSecuringRoutingModule } from './abandonment-monitor-for-securing-routing.module';
import { AbandonmentMonitorForSecuringComponent } from './abandonment-monitor-for-securing/abandonment-monitor-for-securing.component';
import { ModalReasonComponent } from './abandonment-monitor-for-securing/modal-reason.component';

@NgModule({
  declarations: [AbandonmentMonitorForSecuringComponent, ModalReasonComponent],
  imports: [
    CommonModule,
    AbandonmentMonitorForSecuringRoutingModule,
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
export class AbandonmentMonitorForSecuringModule {}
