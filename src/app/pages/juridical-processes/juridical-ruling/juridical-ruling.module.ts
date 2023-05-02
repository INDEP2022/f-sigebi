/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { JuridicalRulingRoutingModule } from './juridical-ruling-routing.module';

/** COMPONENTS IMPORTS */
import { JuridicalRulingComponent } from './juridical-ruling/juridical-ruling.component';

@NgModule({
  declarations: [JuridicalRulingComponent],
  imports: [CommonModule, JuridicalRulingRoutingModule, SharedModule],
  exports: [JuridicalRulingComponent],
})
export class JuridicalRulingModule {}
