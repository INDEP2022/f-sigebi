/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PasswordCalendarRoutingModule } from './password-calendar-routing.module';

/** COMPONENTS IMPORTS */
import { PasswordCalendarComponent } from './password-calendar/password-calendar.component';

@NgModule({
  declarations: [PasswordCalendarComponent],
  imports: [CommonModule, PasswordCalendarRoutingModule, SharedModule],
})
export class PasswordCalendarModule {}
