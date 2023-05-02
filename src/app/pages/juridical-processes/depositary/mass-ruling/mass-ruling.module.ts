/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { MassRulingRoutingModule } from './mass-ruling-routing.module';

/** COMPONENTS IMPORTS */
import { MassRulingComponent } from './mass-ruling/mass-ruling.component';

@NgModule({
  declarations: [MassRulingComponent],
  imports: [CommonModule, MassRulingRoutingModule, SharedModule],
})
export class MassRulingModule {}
