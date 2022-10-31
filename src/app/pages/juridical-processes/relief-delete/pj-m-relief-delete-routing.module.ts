/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJReliefDeleteComponent } from './relief-delete/pj-c-relief-delete.component';

const routes: Routes = [
  {
    path: '',
    component: PJReliefDeleteComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJReliefDeleteRoutingModule {}
