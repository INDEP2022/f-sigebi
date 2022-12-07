/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { JuridicalRulingGRoutingModule } from './juridical-ruling-g-routing.module';

/** COMPONENTS IMPORTS */
import { JuridicalRulingGComponent } from './juridical-ruling-g/juridical-ruling-g.component';

@NgModule({
  declarations: [JuridicalRulingGComponent],
  imports: [CommonModule, JuridicalRulingGRoutingModule, SharedModule],
  exports: [JuridicalRulingGComponent],
})
export class JuridicalRulingGModule {}
