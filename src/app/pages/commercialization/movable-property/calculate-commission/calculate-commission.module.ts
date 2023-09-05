import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from 'src/app/shared/shared.module';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
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
    FormLoaderComponent,
    TooltipModule,
    AccordionModule,
  ],
})
export class CalculateCommissionModule {}
