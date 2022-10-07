import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CBRdodiMReclassRecoveryOrdersRoutingModule } from './c-b-rdodi-m-reclass-recovery-orders-routing.module';
import { CBRdodiCReclassRecoveryOrdersComponent } from './c-b-rdodi-c-reclass-recovery-orders/c-b-rdodi-c-reclass-recovery-orders.component';


@NgModule({
  declarations: [
    CBRdodiCReclassRecoveryOrdersComponent
  ],
  imports: [
    CommonModule,
    CBRdodiMReclassRecoveryOrdersRoutingModule,
    SharedModule,
    Ng2SmartTableModule,
    BsDatepickerModule
  ]
})
export class CBRdodiMReclassRecoveryOrdersModule { }
