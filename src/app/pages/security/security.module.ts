/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { SecurityRoutingModule } from './security-routing.module';

/** COMPONENTS IMPORTS */

@NgModule({
  declarations: [],
  imports: [CommonModule, SecurityRoutingModule, SharedModule],
})
export class SecurityModule {}
