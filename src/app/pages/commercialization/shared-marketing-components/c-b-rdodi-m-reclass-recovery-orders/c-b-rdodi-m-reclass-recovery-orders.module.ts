import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { CBRdodiCReclassRecoveryOrdersComponent } from './c-b-rdodi-c-reclass-recovery-orders/c-b-rdodi-c-reclass-recovery-orders.component';
import { CBRdodiMReclassRecoveryOrdersRoutingModule } from './c-b-rdodi-m-reclass-recovery-orders-routing.module';

@NgModule({
  declarations: [CBRdodiCReclassRecoveryOrdersComponent],
  imports: [
    CommonModule,
    CBRdodiMReclassRecoveryOrdersRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class CBRdodiMReclassRecoveryOrdersModule {}
