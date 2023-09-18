import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxCurrencyModule } from 'ngx-currency';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConciliationExecutionMainComponent } from './conciliation-execution-main/conciliation-execution-main.component';
import { NewAndUpdateComponent } from './conciliation-execution-main/new-and-update/new-and-update.component';
import { ConciliationExecutionRoutingModule } from './conciliation-execution-routing.module';
export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: false,
};
@NgModule({
  declarations: [ConciliationExecutionMainComponent, NewAndUpdateComponent],
  imports: [
    CommonModule,
    ConciliationExecutionRoutingModule,
    SharedModule,
    NgScrollbarModule,
    BsDatepickerModule,
    TooltipModule.forRoot(),
    AccordionModule,
    FormLoaderComponent,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class ConciliationExecutionModule {}
