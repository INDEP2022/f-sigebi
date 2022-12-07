/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { MaintenanceLegalRulingComponent } from './maintenance-legal-rulings/maintenance-legal-rulings.component';

const routes: Routes = [
  {
    path: '',
    component: MaintenanceLegalRulingComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaintenanceLegalRulingRoutingModule {}
