/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedJuridicalProcessesModule } from '../../../shared-juridical-processes/shared-juridical-processes.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { DispersalDepositaryPaymentsRoutingModule } from './dispersal-depositary-payments-routing.module';

/** COMPONENTS IMPORTS */
import { NgxCurrencyModule } from 'ngx-currency';
import { DataConfigurationModalComponent } from './data-configuration-modal/data-configuration-modal.component';
import { DispersalDepositaryPaymentsComponent } from './dispersal-depositary-payments/dispersal-depositary-payments.component';

export const customCurrencyMaskConfig = {
  align: 'left',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '$',
  suffix: '',
  thousands: ',',
  nullable: false,
};
@NgModule({
  declarations: [
    DispersalDepositaryPaymentsComponent,
    DataConfigurationModalComponent,
  ],
  imports: [
    CommonModule,
    DispersalDepositaryPaymentsRoutingModule,
    SharedModule,
    SharedJuridicalProcessesModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class DispersalDepositaryPaymentsModule {}
