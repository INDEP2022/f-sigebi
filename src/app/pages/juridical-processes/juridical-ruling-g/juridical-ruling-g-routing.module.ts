/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { JuridicalRulingGComponent } from './juridical-ruling-g/juridical-ruling-g.component';

const routes: Routes = [
  {
    path: '',
    component: JuridicalRulingGComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuridicalRulingGRoutingModule {}
