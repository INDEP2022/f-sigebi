/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { GDRSDRegisterReturnRoutingModule } from './register-return-routing.module';

/** COMPONENTS IMPORTS */
import { GDRSDRegisterReturnComponent } from './register-return/gd-rsd-c-register-return.component';

@NgModule({
  declarations: [GDRSDRegisterReturnComponent],
  imports: [CommonModule, GDRSDRegisterReturnRoutingModule, SharedModule],
  providers: [],
})
export class GDRSDRegisterReturnModule {}
