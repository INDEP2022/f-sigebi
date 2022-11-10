/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { SCCPasswordCalendarComponent } from './password-calendar/s-cc-c-password-calendar.component';

const routes: Routes = [
  {
    path: '',
    component: SCCPasswordCalendarComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SCCPasswordCalendarRoutingModule {}
