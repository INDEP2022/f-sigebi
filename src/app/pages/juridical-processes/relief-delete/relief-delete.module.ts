/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ReliefDeleteRoutingModule } from './relief-delete-routing.module';

/** COMPONENTS IMPORTS */
import { ReliefDeleteComponent } from './relief-delete/relief-delete.component';

@NgModule({
  declarations: [ReliefDeleteComponent],
  imports: [CommonModule, ReliefDeleteRoutingModule, SharedModule],
})
export class ReliefDeleteModule {}
