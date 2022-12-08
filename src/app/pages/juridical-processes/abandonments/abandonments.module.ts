/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { AbandonmentsRoutingModule } from './abandonments-routing.module';

/** COMPONENTS IMPORTS */
import { AbandonmentsComponent } from './abandonments/abandonments.component';

@NgModule({
  declarations: [AbandonmentsComponent],
  imports: [CommonModule, AbandonmentsRoutingModule, SharedModule],
})
export class AbandonmentsModule {}
