/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJMaintenanceLegalRulingComponent } from './maintenance-legal-rulings/pj-c-maintenance-legal-rulings.component';

const routes: Routes = [
  {
    path: '',
    component: PJMaintenanceLegalRulingComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJMaintenanceLegalRulingRoutingModule {}
