/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { SCCChangePasswordRoutingModule } from './s-cc-m-change-password-routing.module';

/** COMPONENTS IMPORTS */
import { SCCChangePasswordComponent } from './change-password/s-cc-c-change-password.component';

@NgModule({
  declarations: [SCCChangePasswordComponent],
  imports: [CommonModule, SCCChangePasswordRoutingModule, SharedModule],
})
export class SCCChangePasswordModule {}
