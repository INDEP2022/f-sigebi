/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDDMPDMassRulingRoutingModule } from './pj-d-dmpd-m-mass-ruling-routing.module';

/** COMPONENTS IMPORTS */
import { PJDDMPDMassRulingComponent } from './mass-ruling/pj-d-dmpd-c-mass-ruling.component';

@NgModule({
  declarations: [PJDDMPDMassRulingComponent],
  imports: [CommonModule, PJDDMPDMassRulingRoutingModule, SharedModule],
})
export class PJDDMPDMassRulingModule {}
