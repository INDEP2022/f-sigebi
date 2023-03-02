import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { CalculateCommissionRoutingModule } from './calculate-commission-routing.module';
import { CalculateCommissionComponent } from './calculate-commission/calculate-commission.component';
import { ComcalculatedModalComponent } from './comcalculated-modal/comcalculated-modal.component';
import { CommissionsModalComponent } from './commissions-modal/commissions-modal.component';

@NgModule({
  declarations: [
    CalculateCommissionComponent,
    ComcalculatedModalComponent,
    CommissionsModalComponent,
  ],
  imports: [
    CommonModule,
    CalculateCommissionRoutingModule,
    SharedModule,
    BsDatepickerModule,
  ],
})
export class CalculateCommissionModule {}
