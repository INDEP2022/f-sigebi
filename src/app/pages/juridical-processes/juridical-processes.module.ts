/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { JuridicalProcessesRoutingModule } from './juridical-processes-routing.module';

/** COMPONENTS IMPORTS */

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JuridicalProcessesRoutingModule,
    SharedModule,
  ],
})
export class JuridicalProcessesModule {}
