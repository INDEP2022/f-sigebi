/** BASE IMPORT */
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/** LIBRERÍAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */

/** COMPONENTS IMPORTS */
import { PJDVPThirdpartiesPossessionValidationComponent } from './thirdparties-possession-validation/pj-d-vp-c-thirdparties-possession-validation.component';

const routes: Routes = [
  {
    path: '',
    component: PJDVPThirdpartiesPossessionValidationComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PJDVPThirdpartiesPossessionValidationRoutingModule {}
