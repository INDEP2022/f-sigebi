import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { CBRdodiMReclassRecoveryOrdersRoutingModule } from './c-b-rdodi-m-reclass-recovery-orders-routing.module';
import { CBRdodiCReclassRecoveryOrdersComponent } from './c-b-rdodi-c-reclass-recovery-orders/c-b-rdodi-c-reclass-recovery-orders.component';

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
