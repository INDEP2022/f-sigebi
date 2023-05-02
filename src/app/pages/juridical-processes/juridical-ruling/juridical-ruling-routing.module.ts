/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { JuridicalRulingComponent } from './juridical-ruling/juridical-ruling.component';

const routes: Routes = [
  {
    path: '',
    component: JuridicalRulingComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JuridicalRulingRoutingModule {}
