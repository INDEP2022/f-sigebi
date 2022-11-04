/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDJJuridicalRulingGComponent } from './juridical-ruling-g/pj-dj-c-juridical-ruling-g.component';

const routes: Routes = [
  {
    path: '',
    component: PJDJJuridicalRulingGComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDJJuridicalRulingGRoutingModule {}
