/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDJJuridicalRulingGRoutingModule } from './pj-dj-m-juridical-ruling-g-routing.module';

/** COMPONENTS IMPORTS */
import { PJDJJuridicalRulingGComponent } from './juridical-ruling-g/pj-dj-c-juridical-ruling-g.component';

@NgModule({
  declarations: [PJDJJuridicalRulingGComponent],
  imports: [CommonModule, PJDJJuridicalRulingGRoutingModule, SharedModule],
  exports: [PJDJJuridicalRulingGComponent],
})
export class PJDJJuridicalRulingGModule {}
