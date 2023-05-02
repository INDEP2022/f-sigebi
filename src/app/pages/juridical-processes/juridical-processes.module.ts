/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { JuridicalProcessesRoutingModule } from './juridical-processes-routing.module';
import { FormSearchHandlerModule } from './shared/form-search-handler/form-search-handler.module';

/** COMPONENTS IMPORTS */

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JuridicalProcessesRoutingModule,
    SharedModule,
    FormSearchHandlerModule,
  ],
  exports: [FormSearchHandlerModule],
})
export class JuridicalProcessesModule {}
