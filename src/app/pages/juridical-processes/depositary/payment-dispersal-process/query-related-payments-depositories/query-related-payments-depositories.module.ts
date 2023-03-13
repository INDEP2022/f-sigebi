/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */
import { SharedJuridicalProcessesModule } from '../../../shared-juridical-processes/shared-juridical-processes.module';

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { QueryRelatedPaymentsDepositoriesRoutingModule } from './query-related-payments-depositories-routing.module';

/** COMPONENTS IMPORTS */
import { QueryRelatedPaymentsDepositoriesComponent } from './query-related-payments-depositories/query-related-payments-depositories.component';

@NgModule({
  declarations: [QueryRelatedPaymentsDepositoriesComponent],
  imports: [
    CommonModule,
    QueryRelatedPaymentsDepositoriesRoutingModule,
    SharedModule,
    SharedJuridicalProcessesModule,
  ],
})
export class QueryRelatedPaymentsDepositoriesModule {}
