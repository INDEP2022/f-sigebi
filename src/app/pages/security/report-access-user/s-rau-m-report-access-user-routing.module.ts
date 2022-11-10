/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { SRAUReportAccessUserComponent } from './report-access-user/s-rau-c-report-access-user.component';

const routes: Routes = [
  {
    path: '',
    component: SRAUReportAccessUserComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SRAUReportAccessUserRoutingModule {}
