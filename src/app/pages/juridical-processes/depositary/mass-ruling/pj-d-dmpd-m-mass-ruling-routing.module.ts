/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDDMPDMassRulingComponent } from './mass-ruling/pj-d-dmpd-c-mass-ruling.component';

const routes: Routes = [
  {
    path: '',
    component: PJDDMPDMassRulingComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDDMPDMassRulingRoutingModule {}
