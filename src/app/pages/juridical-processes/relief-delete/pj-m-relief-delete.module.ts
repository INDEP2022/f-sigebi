/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJReliefDeleteRoutingModule } from './pj-m-relief-delete-routing.module';

/** COMPONENTS IMPORTS */
import { PJReliefDeleteComponent } from './relief-delete/pj-c-relief-delete.component';

@NgModule({
  declarations: [PJReliefDeleteComponent],
  imports: [CommonModule, PJReliefDeleteRoutingModule, SharedModule],
})
export class PJReliefDeleteModule {}
