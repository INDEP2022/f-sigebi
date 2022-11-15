/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { SCCPasswordCalendarRoutingModule } from './s-cc-m-password-calendar-routing.module';

/** COMPONENTS IMPORTS */
import { SCCPasswordCalendarComponent } from './password-calendar/s-cc-c-password-calendar.component';

@NgModule({
  declarations: [SCCPasswordCalendarComponent],
  imports: [CommonModule, SCCPasswordCalendarRoutingModule, SharedModule],
})
export class SCCPasswordCalendarModule {}
