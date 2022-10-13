/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJDJJuridicalRulingRoutingModule } from './pj-dj-m-juridical-ruling-routing.module';

/** COMPONENTS IMPORTS */
import { PJDJJuridicalRulingComponent } from './juridical-ruling/pj-dj-c-juridical-ruling.component';

@NgModule({
  declarations: [
    PJDJJuridicalRulingComponent
  ],
  imports: [
    CommonModule,
    PJDJJuridicalRulingRoutingModule,
    SharedModule,
  ],
})
export class PJDJJuridicalRulingModule {}
