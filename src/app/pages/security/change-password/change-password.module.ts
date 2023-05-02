/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ChangePasswordRoutingModule } from './change-password-routing.module';

/** COMPONENTS IMPORTS */
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  declarations: [ChangePasswordComponent],
  imports: [CommonModule, ChangePasswordRoutingModule, SharedModule],
})
export class ChangePasswordModule {}
